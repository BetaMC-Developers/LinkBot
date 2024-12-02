import { Events, type Message } from "discord.js";
import config from "../../../config";
import { client } from "../../../index";
import { CommandHandler } from "../../commands/services/CommandHandler";
import { Event } from "../base/Event";

export default new Event({
	name: Events.MessageCreate,
	async execute(message: Message): Promise<void> {
		if (!client.user || message.author.bot || !message.content.startsWith(config.prefix)) return;
		await CommandHandler.handlePrefixCommand(message);
	},
});
