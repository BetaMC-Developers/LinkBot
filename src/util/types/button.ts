import type { ButtonInteraction } from "discord.js";
import { z } from "zod";

export type Button = {
	customId: string;
	execute(interaction: ButtonInteraction): Promise<void> | void;
};

export const buttonSchema = z.object({
	customId: z.string(),
	execute: z.function(),
});

export function isButton(structure: unknown): structure is Button {
	return buttonSchema.safeParse(structure).success;
}
