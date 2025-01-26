import process from "node:process";
import { setTimeout } from "node:timers";
import { Events, ChannelType } from "discord.js";
import type { Event } from "../util/types/event.js";

export default {
	name: Events.MessageCreate,
	execute(message) {
		try {
			const CONFIG = {
				channel: process.env.LINK_CHANNEL ?? "",
			};

			if (
				message.channelId === CONFIG.channel &&
				message.channel.type !== ChannelType.DM &&
				message.author.id !== message.client.user?.id
			) {
				setTimeout(() => {
					void message.delete();
				}, 5_000);
			}
		} catch (error) {
			console.error("Error in message processing:", error);
		}
	},
} as const satisfies Event<Events.MessageCreate>;
