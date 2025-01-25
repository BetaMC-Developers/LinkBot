import { Events, MessageFlags } from "discord.js";
import { client } from "../../util/constants/client.js";
import logger from "../../util/constants/logger.js";
import { errorEmbed } from "../../util/embeds/error.js";
import type { Event } from "../../util/types/event.js";

export default {
	name: Events.InteractionCreate,
	async execute(interaction) {
		try {
			if (interaction.isChatInputCommand()) {
				const command = client.commands.get(interaction.commandName);
				await command?.execute({ interaction });
			} else if (interaction.isButton()) {
				const button = client.buttons.get(interaction.customId);
				await button?.execute(interaction);
			} else if (interaction.isStringSelectMenu()) {
				const selectMenu = client.selectMenus.get(interaction.customId);
				await selectMenu?.execute(interaction);
			} else if (interaction.isModalSubmit()) {
				const modal = client.modals.get(interaction.customId);
				await modal?.execute(interaction);
			}
		} catch (error) {
			if (interaction.isRepliable()) {
				await interaction.reply({
					embeds: [errorEmbed],
					flags: MessageFlags.Ephemeral,
				});
			}

			logger.error(error as Error);
		}
	},
} as const satisfies Event<Events.InteractionCreate>;
