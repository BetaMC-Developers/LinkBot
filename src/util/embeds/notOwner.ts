import { EmbedBuilder } from "discord.js";
import { EMBED_COLOR } from "../constants/embedColor.js";

const notOwner = new EmbedBuilder()
	.setTitle("❌ Error")
	.setFields({
		name: "Error",
		value: "This command is only available to the owner of the bot.",
	})
	.setColor(EMBED_COLOR.red);

export { notOwner };
