import type { ClientOptions } from "discord.js";
import type { Features } from "./Features";

export type ExtendedClientOptions = ClientOptions & {
	disabledFeatures?: Features[];
	features: Features[];
	uploadCommands: boolean;
	// plugins?: Coming Soon
}
