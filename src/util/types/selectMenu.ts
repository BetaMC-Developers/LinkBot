import type { AnySelectMenuInteraction } from "discord.js";
import { z } from "zod";

export type SelectMenu = {
	customId: string;
	execute(interaction: AnySelectMenuInteraction): Promise<void> | void;
};

export const selectMenuSchema = z.object({
	customId: z.string(),
	execute: z.function(),
});

export function isSelectMenu(structure: unknown): structure is SelectMenu {
	return selectMenuSchema.safeParse(structure).success;
}
