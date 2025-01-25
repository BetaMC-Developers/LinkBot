import type { ChatInputCommandInteraction, RESTPostAPIApplicationCommandsJSONBody } from "discord.js";
import { z } from "zod";

export type CommandExecuteOptions = {
	interaction: ChatInputCommandInteraction;
};

export type Command = {
	data: RESTPostAPIApplicationCommandsJSONBody;
	devOnly?: boolean;
	execute(options: CommandExecuteOptions): Promise<void> | void;
	ownerOnly?: boolean;
};

export const commandSchema = z.object({
	data: z.record(z.any()),
	devOnly: z.boolean().optional(),
	ownerOnly: z.boolean().optional(),
	execute: z.function(),
});

export function isCommand(structure: unknown): structure is Command {
	return commandSchema.safeParse(structure).success;
}
