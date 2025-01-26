import { EmbedBuilder, PermissionFlagsBits } from "discord.js";
import { EMBED_COLOR } from "../util/constants/embedColor.js";
import type { Command } from "../util/types/command.js";

export default {
	data: {
		name: "deploy-embeds",
		description: "Deploys embeds to the server.",
		dm_permission: false,
		default_member_permissions: PermissionFlagsBits.Administrator.toString(),
	},
	async execute({ interaction }) {
		try {
			await interaction.deferReply();

			const embed = new EmbedBuilder()
				.setTitle("Please link your account using the following command:")
				.setDescription("```!link```")
				.setColor(EMBED_COLOR.black)
				.setTimestamp()
				.setThumbnail(interaction.client.user?.displayAvatarURL() ?? "");

			const channel = interaction.guild?.channels.cache.find(
				(channel) => channel.name === "link-your-account-to-continue",
			);

			if (channel?.isTextBased()) {
				await channel.send({ embeds: [embed] });
				await interaction.editReply({
					content: "I have sent the message to the channel.",
				});
			} else {
				await interaction.editReply({
					content: "I can't find the channel to send the message to.",
				});
			}
		} catch (error) {
			console.error(error);
		}
	},
} as const satisfies Command;
