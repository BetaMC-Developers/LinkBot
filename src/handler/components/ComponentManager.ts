import type { ExtendedClient } from "../core/ExtendedClient";
import { ComponentRegistrar } from "./services/ComponentRegistrar";

export const ComponentManager = {
	async registerComponents(client: ExtendedClient): Promise<void> {
		await ComponentRegistrar.registerComponents(client);
	},

	async reloadComponents(client: ExtendedClient): Promise<void> {
		await ComponentRegistrar.reloadComponents(client);
	},
};
