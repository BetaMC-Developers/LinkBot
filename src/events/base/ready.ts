import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import process from "node:process";
import { Events } from "discord.js";
import { load } from "js-yaml";
import { client } from "../../util/constants/client.js";
import FolderWatcher from "../../util/constants/folderWatcher.js";
import logger from "../../util/constants/logger.js";
import { BOT_STATUS } from "../../util/constants/status.js";
import type { Event } from "../../util/types/event.js";

const CONFIG = {
	memberRole: process.env.MEMBER_ROLE ?? "",
};

const filePath = path.join(os.homedir(), "bmc", "plugins", "DiscordAuthentication", "data.yml");

const processedUserIds = new Set<string>();

async function loadYAMLFile() {
	try {
		const fileContents = await fs.promises.readFile(filePath);
		const data = load(fileContents.toString()) as { authentication?: unknown };

		if (data.authentication) {
			const newEntries = Object.entries(data.authentication)
				.reverse() // This will give the newest entries first
				.filter(([id]) => !processedUserIds.has(id));

			for (const [, userInfo] of newEntries) {
				const username = userInfo.username as string;
				const id = userInfo.discordID as string;

				const guild = client.guilds.cache.first();

				if (!guild) {
					throw new Error("Guild not found");
				}

				const member = guild.members.cache.get(id);

				if (member && member.nickname !== username) {
					await member.setNickname(username);
					console.log(`Set ${member.user.tag}'s nickname to ${username}`);
				}

				if (member && !member.roles.cache.has(CONFIG.memberRole)) {
					await member.roles.add(CONFIG.memberRole);
					console.log(`Added ${member.user.tag} to the member role`);
				}

				processedUserIds.add(id);
			}
		}
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

		await loadYAMLFile();
		const watcher = new FolderWatcher(path.dirname(filePath), false);
		watcher.onChange = async () => {
			console.log("YML file changed");
			await loadYAMLFile();
		};
	},
} as const satisfies Event<Events.ClientReady>;
