import { ActivityType, Events, PresenceUpdateStatus } from "discord.js";
import type { ExtendedClient } from "../handler";
import { Event } from "../handler";

export default new Event({
	name: Events.ClientReady,
	once: true,
	async execute(client: ExtendedClient): Promise<void> {
		client.user?.setStatus(PresenceUpdateStatus.Online);
		client.user?.setActivity("Development", { type: ActivityType.Watching });
	},
});
