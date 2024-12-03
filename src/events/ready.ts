/* eslint-disable require-atomic-updates */
import process from "node:process";
import { setInterval } from "node:timers";
import { ActivityType, Events, PresenceUpdateStatus } from "discord.js";
import type { ExtendedClient } from "../handler";
import { Event } from "../handler";
import { client } from "../index";

async function checkForUpdates(lastCheckedTime: number): Promise<any[]> {
	try {
		const result = await client.queryDatabase("SELECT * FROM link_data WHERE linkTime > ?", [lastCheckedTime]);

		if (result.length > 0) {
			console.log(`Found ${result.length} updates.`);
			return result;
		} else {
			return [];
		}
	} catch (error) {
		console.error("Error querying the database for updates:", error);
		return [];
	}
}

async function setNickname(guildId: string, discordID: string, username: string) {
	console.log(`Attempting to set nickname for user ${discordID} to ${username}`);
	try {
		const guild = await client.guilds.fetch(guildId);
		const member = await guild.members.fetch(discordID);

		await member.setNickname(username);
		console.log(`Nickname for user ${discordID} set to ${username}`);
	} catch (error) {
		console.error(`Failed to set nickname for ${discordID}:`, error);
	}
}

let lastCheckedTime = Date.now();

function startUpdateChecker() {
	setInterval(async () => {
		try {
			const updates = await checkForUpdates(lastCheckedTime);
			if (updates.length > 0) {
				for (const update of updates) {
					const { discordID, username } = update;
					console.log(`Setting nickname for user ${discordID} to ${username}`);

					await setNickname(process.env.GUILD_ID, discordID, username);
				}
			} else {
				return;
			}

			lastCheckedTime = Date.now();
		} catch (error) {
			console.error("Error checking for updates:", error);
		}
	}, 60_000);
}

export default new Event({
	name: Events.ClientReady,
	once: true,
	async execute(client: ExtendedClient): Promise<void> {
		client.user?.setStatus(PresenceUpdateStatus.Online);
		client.user?.setActivity("Development", { type: ActivityType.Watching });

		startUpdateChecker();
	},
});
