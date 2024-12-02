import path from "node:path";
import config from "../../config";
import type { ExtendedClient } from "../core/ExtendedClient";
import { Features } from "../types/Features";
import { LogManager } from "../utils/LogManager";
import { ModuleManager } from "../utils/ModuleManager";
import { Event } from "./base/Event";

export class EventManager {
	private static readonly DEFAULT_LISTENER_PATH: string = path.join(__dirname, "../../handler/events/listeners");

	private static readonly folderPaths: string[] = [
		path.join(__dirname, `../../${config.eventsFolder}`),
		this.DEFAULT_LISTENER_PATH,
	];

	public static async registerEvents(client: ExtendedClient): Promise<void> {
		const pathsToLoad: string[] = client.isEnabledFeature(Features.Events)
			? this.folderPaths
			: [this.DEFAULT_LISTENER_PATH];

		try {
			for (const folderPath of pathsToLoad) {
				const eventFiles: string[] = await ModuleManager.getAllModulePaths(folderPath);
				const eventModules = await Promise.all(eventFiles.map(ModuleManager.importModule));

				for (const [index, module] of eventModules.entries()) {
					const event = module?.default;
					if (event instanceof Event) {
						this.registerEvent(client, event, eventFiles[index]);
					} else {
						LogManager.logError(
							`Invalid event in file: ${eventFiles[index]}. Expected an instance of Event.`,
						);
					}
				}
			}
		} catch (error) {
			LogManager.logError("Error registering events", error);
		}
	}

	public static async reloadEvents(client: ExtendedClient): Promise<void> {
		if (!client.isEnabledFeature(Features.Events)) return;

		try {
			client.events = [];
			client.removeAllListeners();
			await Promise.all(this.folderPaths.map(ModuleManager.clearModulesInDirectory));
			await this.registerEvents(client);
		} catch (error) {
			LogManager.logError("Error reloading events", error);
		}
	}

	private static registerEvent(client: ExtendedClient, event: Event, _filePath: string): void {
		if (!client.events.includes(event.name)) client.events.push(event.name);

		client[event.once ? "once" : "on"](event.name, async (...args): Promise<void> => {
			try {
				await event.execute(...args);
			} catch (error) {
				LogManager.logError(`Error executing event ${event.name}:`, error);
			}
		});
	}
}
