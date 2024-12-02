import type { GatewayIntentBits } from "discord.js";

export type Config = {
	commandsFolder: string;
	componentsFolder: string;
	defaultIntents: GatewayIntentBits[];
	deniedCommandReplies: any;
	eventsFolder: string;
	ownerId?: string[];
	prefix: string;
};
