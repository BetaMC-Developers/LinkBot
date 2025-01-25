import type { ModalSubmitInteraction } from "discord.js";
import { z } from "zod";

export type Modal = {
	customId: string;
	execute(interaction: ModalSubmitInteraction): Promise<void> | void;
};

export const modalSchema = z.object({
	customId: z.string(),
	execute: z.function(),
});

export function isModal(structure: unknown): structure is Modal {
	return modalSchema.safeParse(structure).success;
}
