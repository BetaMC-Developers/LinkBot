import { EmbedBuilder } from "discord.js";
import { EMBED_COLOR } from "../constants/embedColor.js";

const notDev = new EmbedBuilder()
	.setTitle("❌ Error")
	.setFields({
		name: "Error",
		value: "This command is only available to developers.",
	})
	.setColor(EMBED_COLOR.red);

export { notDev };
