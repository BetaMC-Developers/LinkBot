import path from "node:path";
import config from "../../../config";
import type { ExtendedClient } from "../../core/ExtendedClient";
import { emptyCommandCollections } from "../../types/CommandCollections";
import { Features } from "../../types/Features";
import { LogManager } from "../../utils/LogManager";
import { ModuleManager } from "../../utils/ModuleManager";
import { ContextMenu } from "../interactions/ContextMenu";
import { SlashCommand } from "../interactions/SlashCommand";
import { PrefixCommand } from "../prefix/PrefixCommand";

type Command = ContextMenu | PrefixCommand | SlashCommand;

export class CommandRegistrar {
	private static readonly folderPath: string = path.join(__dirname, `../../../${config.commandsFolder}`);

	public static async registerCommands(client: ExtendedClient): Promise<void> {
		try {
			const commandFiles: string[] = await ModuleManager.getAllModulePaths(this.folderPath);
			const commandModules: any[] = await Promise.all(commandFiles.map(ModuleManager.importModule));
			for (const [index, module] of commandModules.entries()) {
				this.registerCommand(client, module, commandFiles[index]);
			}
		} catch (error) {
			LogManager.logError("Error registering commands", error);
		}
	}

	public static async reloadCommands(client: ExtendedClient): Promise<void> {
		try {
			client.commands = emptyCommandCollections;
			await ModuleManager.clearModulesInDirectory(this.folderPath);
			await this.registerCommands(client);
		} catch (error) {
			LogManager.logError("Error reloading commands", error);
		}
	}

	private static registerCommand(client: ExtendedClient, commandModule: any, filePath: string): void {
		const { default: command } = commandModule;

		if (!this.isValidCommand(command)) {
			LogManager.logError(`Invalid command in file: ${filePath}. Expected an instance of a Command class.`);
			return;
		}

		if (command instanceof SlashCommand && client.isEnabledFeature(Features.SlashCommands)) {
			client.commands.slash.set(command.data.name, command);
		} else if (command instanceof ContextMenu && client.isEnabledFeature(Features.ContextMenus)) {
			client.commands.context.set(command.data.name, command);
		} else if (command instanceof PrefixCommand && client.isEnabledFeature(Features.PrefixCommands)) {
			client.commands.prefix.set(command.name, command);
			if (command.aliases) {
				for (const alias of command.aliases) {
					client.commands.prefixAliases.set(alias, command.name);
				}
			}
		}
	}

	private static isValidCommand(command: any): command is Command {
		return command instanceof SlashCommand || command instanceof ContextMenu || command instanceof PrefixCommand;
	}
}
