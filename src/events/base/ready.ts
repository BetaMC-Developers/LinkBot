import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import process from "node:process";
import { setTimeout } from "node:timers";
import { Events, Guild, GuildMember } from "discord.js";
import { load } from "js-yaml";
import { client } from "../../util/constants/client.js";
import logger from "../../util/constants/logger.js";
import { BOT_STATUS } from "../../util/constants/status.js";
import type { Event } from "../../util/types/event.js";

const CONFIG = {
	memberRole: process.env.MEMBER_ROLE ?? "",
};

const filePath = path.join(os.homedir(), "bmc", "plugins", "DiscordAuthentication", "data.yml");
const processedFilePath = path.join(os.homedir(), "bmc", "plugins", "DiscordAuthentication", "processedUserIds.json");

let processedUserIds: Set<string> = new Set<string>();

function loadProcessedUserIds() {
	try {
		if (fs.existsSync(processedFilePath)) {
			const data = fs.readFileSync(processedFilePath, 'utf-8');
			const parsedData = JSON.parse(data);
			processedUserIds = new Set(parsedData.map((id: string) => id.toString())); 
			console.log(`Loaded ${processedUserIds.size} processed user IDs from file.`);
		} else {
			console.log("Processed user IDs file not found, starting fresh.");
		}
	} catch (error) {
		console.error("Error loading processed user IDs:", error);
	}
}

function saveProcessedUserIds() {
	try {
		const data = JSON.stringify(Array.from(processedUserIds), null, 2);
		fs.writeFileSync(processedFilePath, data, 'utf-8');
		console.log(`Saved ${processedUserIds.size} processed user IDs to file.`);
	} catch (error) {
		console.error("Error saving processed user IDs:", error);
	}
}

async function fetchMemberIfNeeded(guild: Guild, id: string): Promise<GuildMember | undefined> {
	if (guild.members.cache.has(id)) {
		return guild.members.cache.get(id);
	}

	try {
		const member = await guild.members.fetch(id);
		return member;
	} catch (error) {
		return undefined;
	}
}

async function loadYAMLFile() {
	try {
		const fileContents = await fs.promises.readFile(filePath);
		const data = load(fileContents.toString()) as { authentication?: Record<string, any> };

		if (data.authentication) {
			const newEntries = Object.entries(data.authentication)
				.reverse()
				.filter(([uuid, userInfo]) => {
					const discordID = userInfo.discordID;
					const username = userInfo.username;

					if (!discordID || !username) {
						console.error(`Invalid entry for UUID ${uuid}: Missing discordID or username.`);
						console.error(`Data:`, userInfo); 
						return false; 
					}

					const idString = discordID.toString(); 
					
					const isNew = !processedUserIds.has(idString);

					if (isNew) {
						console.log(`New entry found: ${idString}`); 
					} 
					return isNew; 
				});

			if (newEntries.length === 0) {
				console.log("No new entries in YAML file");
				return;
			}

			console.log(`Found ${newEntries.length} new entries to process`);

			for (const [, userInfo] of newEntries) {
				const username = userInfo.username as string;
				const id = userInfo.discordID as string; 

				const guild = client.guilds.cache.get("1295264275241242655");

				if (!guild) {
					throw new Error("Guild not found");
				}

				let member = await fetchMemberIfNeeded(guild, id);

				if (member) {
					if (member.nickname !== username) {
						await member.setNickname(username);
					}

					if (!member.roles.cache.has(CONFIG.memberRole)) {
						await member.roles.add(CONFIG.memberRole);
					}
				} else {
					console.log(`Member with ID ${id} not found in the guild after fetch attempt`);
				}

				processedUserIds.add(id);
			}

			saveProcessedUserIds();
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

		loadProcessedUserIds();

		try {
			await loadYAMLFile();
		} catch (error) {
			console.error(`Error reading YAML file: ${error}`);
		}

		fs.watch(path.dirname(filePath), (eventType, filename) => {
			if (eventType === 'change' && filename === 'data.yml') {
				setTimeout(async () => {
					await loadYAMLFile();
				}, 3_000);
			}
		});
	},
} as const satisfies Event<Events.ClientReady>;
