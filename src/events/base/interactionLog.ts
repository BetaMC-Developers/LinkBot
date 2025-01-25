import { Events } from "discord.js";
import logger from "../../util/constants/logger.js";
import type { Event } from "../../util/types/event.js";

export default {
	name: Events.InteractionCreate,
	async execute(interaction) {
		try {
			switch (true) {
				case interaction.isChatInputCommand():
					logger.info(`${interaction.user.tag} (${interaction.user.id}) > /${interaction.commandName}`);
					break;
				case interaction.isButton():
					logger.info(`${interaction.user.tag} (${interaction.user.id}) > button: ${interaction.customId}`);
					break;
				case interaction.isStringSelectMenu():
					logger.info(
						`${interaction.user.tag} (${interaction.user.id}) > selectMenu: ${interaction.customId}`,
					);
					break;
				case interaction.isModalSubmit():
					logger.info(`${interaction.user.tag} (${interaction.user.id}) > modal: ${interaction.customId}`);
					break;
				default:
					logger.info(`${interaction.user.tag} (${interaction.user.id}) > unknown interaction`);
					break;
			}
		} catch (error) {
			console.error(error);
		}
	},
} as const satisfies Event<Events.InteractionCreate>;
