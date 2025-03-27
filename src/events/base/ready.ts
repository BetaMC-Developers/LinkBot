import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import process from "node:process";
import { setTimeout } from "node:timers";
import { Events } from "discord.js";
import { load } from "js-yaml";
import Database from "better-sqlite3";
import { client } from "../../util/constants/client.js";
import logger from "../../util/constants/logger.js";
import { BOT_STATUS } from "../../util/constants/status.js";
import type { Event } from "../../util/types/event.js";

const db = new Database(path.join(os.homedir(), "bmc", "plugins", "DiscordAuthentication", "processedUsers.db"));
db.prepare("CREATE TABLE IF NOT EXISTS processed_users (discord_id TEXT PRIMARY KEY)").run();

const CONFIG = {
	memberRole: process.env.MEMBER_ROLE ?? "",
};

const filePath = path.join(os.homedir(), "bmc", "plugins", "DiscordAuthentication", "data.yml");

async function loadYAMLFile() {
	try {
		const fileContents = await fs.promises.readFile(filePath);
		const data = load(fileContents.toString()) as { authentication?: Record<string, any> };

		if (!data.authentication) {
			console.log("No authentication data found in YAML file.");
			return;
		}

		console.log("Loaded YAML data at:", new Date().toISOString());

		const guild = client.guilds.cache.get("1295264275241242655");
		if (!guild) {
			throw new Error("Guild not found");
		}

		const newEntries = Object.entries(data.authentication)
			.reverse()
			.filter(([uuid, userInfo]) => {
				const discordID = userInfo.discordID;
				const username = userInfo.username;

				if (!discordID || !username) {
					console.error(`Invalid entry for UUID ${uuid}: Missing discordID or username.`);
					return false;
				}

				const idString = discordID.toString();

				const isNew = !db.prepare("SELECT 1 FROM processed_users WHERE discord_id = ?").get(idString);

				return isNew;
			});

		if (newEntries.length === 0) {
			console.log("No new entries to process.");
			return;
		}

		console.log(`Found ${newEntries.length} new entries to process.`);

		const insertStmt = db.prepare("INSERT OR IGNORE INTO processed_users (discord_id) VALUES (?)");
		const insertTransaction = db.transaction((entries: string[]) => {
			for (const id of entries) insertStmt.run(id);
		});

		const idsToInsert = newEntries.map(([, userInfo]) => userInfo.discordID.toString());
		insertTransaction(idsToInsert);

		for (const [, userInfo] of newEntries) {
			const username = userInfo.username as string;
			const id = userInfo.discordID as string;

			let member = guild.members.cache.get(id);
			if (!member) {
				continue;
			}

			let nicknameUpdated = false;
			if (member.nickname !== username) {
				try {
					await member.setNickname(username);
					console.log(`Updated nickname for ${id} to "${username}".`);
					nicknameUpdated = true;
				} catch (error) {
					console.error(`Failed to update nickname for ${id}:`, error);
				}
			}

			let roleAssigned = false;
			if (!member.roles.cache.has(CONFIG.memberRole)) {
				try {
					await member.roles.add(CONFIG.memberRole);
					console.log(`Assigned member role to ${id}.`);
					roleAssigned = true;
				} catch (error) {
					console.error(`Failed to assign role to ${id}:`, error);
				}
			}

			if (!nicknameUpdated && !roleAssigned) {
				continue;
			}
		}
	} catch (error) {
		console.error("Error loading YAML file:", error);
	}
}

export default {
	name: Events.ClientReady,
	once: true,
	async execute(client) {
		client.user.setStatus(BOT_STATUS.Online);
		logger.success(`Logged in as ${client.user.tag}`);

		await loadYAMLFile();

		fs.watch(path.dirname(filePath), (eventType, filename) => {
			if (eventType === "change" && filename === "data.yml") {
				setTimeout(async () => {
					await loadYAMLFile();
				}, 3_000);
			}
		});
	},
} as const satisfies Event<Events.ClientReady>;
