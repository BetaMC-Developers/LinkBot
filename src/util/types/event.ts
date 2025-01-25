import type { ClientEvents } from "discord.js";
import { z } from "zod";

export type Event<Name extends keyof ClientEvents = keyof ClientEvents> = {
	execute(...parameters: ClientEvents[Name]): Promise<void> | void;
	name: Name;
	once?: boolean;
};

export const eventSchema = z.object({
	execute: z.function(),
	name: z.string(),
	once: z.boolean().optional().default(false),
});

export function isEvent(structure: unknown): structure is Event {
	return eventSchema.safeParse(structure).success;
}
