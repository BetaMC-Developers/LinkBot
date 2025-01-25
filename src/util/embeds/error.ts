import { EmbedBuilder } from "discord.js";
import { EMBED_COLOR } from "../constants/embedColor.js";

const errorEmbed = new EmbedBuilder()
	.setTitle("❌ Error")
	.setDescription(
		"**An error occurred while processing your request, please try again later. If the problem persists, please contact the bot owner.**\n\nThis has been logged.",
	)
	.setTimestamp()
	.setColor(EMBED_COLOR.red);

export { errorEmbed };
