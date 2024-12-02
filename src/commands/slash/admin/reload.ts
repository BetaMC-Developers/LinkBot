import { type ChatInputCommandInteraction, Colors, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { RegisterType, SlashCommand } from "../../../handler";
import { client } from "../../../index";

export default new SlashCommand({
	restrictedToOwner: true,
	registerType: RegisterType.Guild,

	data: new SlashCommandBuilder().setName("reload").setDescription("Reloads all events, commands, and components."),

	async execute(interaction: ChatInputCommandInteraction): Promise<void> {
		const embed: EmbedBuilder = new EmbedBuilder();

		try {
			await client.reloadEvents();
			await client.reloadCommands();
			await client.reloadComponents();

			embed.setTitle("Reload Successful").setColor(Colors.Green);
		} catch {
			embed.setTitle("Reload Failed").setDescription("An error occurred while reloading.").setColor(Colors.Red);
		}

		await interaction.reply({ embeds: [embed], ephemeral: true });
	},
});
