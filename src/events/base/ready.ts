import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import process from "node:process";
import { Events } from "discord.js";
import { load } from "js-yaml";
import { client } from "../../util/constants/client.js";
import logger from "../../util/constants/logger.js";
import { BOT_STATUS } from "../../util/constants/status.js";
import type { Event } from "../../util/types/event.js";

const CONFIG = {
	memberRole: process.env.MEMBER_ROLE ?? "",
};

const filePath = path.join(os.homedir(), "bmc", "plugins", "DiscordAuthentication", "data.yml");

async function loadYAMLFile() {
	try {
		const fileContents = await fs.promises.readFile(filePath);
		const data = load(fileContents.toString()) as { authentication?: unknown };

		if (data.authentication) {
			for (const [, userInfo] of Object.entries(data.authentication)) {
				console.log(`Processing User: ${userInfo.username}`);
				console.log(`Discord ID: ${userInfo.discordID}`);

				const guild = client.guilds.cache.first();
				if (!guild) {
					console.error("No guild found.");
					return;
				}

				const member = await guild.members.fetch(userInfo.id);

				if (member) {
					console.log(`Found member: ${member.user.username}`);
					await member.setNickname(userInfo.username);
					console.log(`Set nickname to: ${userInfo.username}`);
				}

				if (!member.roles.cache.has(CONFIG.memberRole)) {
					await member.roles.add(CONFIG.memberRole);
					console.log(`Added role: ${CONFIG.memberRole}`);
				}
			}
		}
	} catch (error) {
		console.error(error);
	}
}

async function checkFile() {
	try {
		fs.watch(filePath, (eventType, filename) => {
			if (eventType === "change") {
				console.log(`File ${filename} changed.`);
				void loadYAMLFile();
			}
		});
	} catch (error) {
		console.error(error);
	}
}

export default {
	name: Events.ClientReady,
	once: true,
	async execute(client) {
		client.user.setStatus(BOT_STATUS.Online);
		logger.success(`Logged in as ${client.user.tag}`);
		void checkFile();
	},
} as const satisfies Event<Events.ClientReady>;
