import type { ExtendedClient } from "../core/ExtendedClient";
import { RegisterType } from "../types/RegisterType";
import type { ContextMenu } from "./interactions/ContextMenu";
import type { SlashCommand } from "./interactions/SlashCommand";
import { CommandDeployer } from "./services/CommandDeployer";
import { CommandRegistrar } from "./services/CommandRegistrar";

export class CommandManager {
	public static async registerCommands(client: ExtendedClient): Promise<void> {
		await CommandRegistrar.registerCommands(client);
	}

	public static async reloadCommands(client: ExtendedClient): Promise<void> {
		await CommandRegistrar.reloadCommands(client);
	}

	public static async deployCommands(client: ExtendedClient): Promise<void> {
		const { guildCommands, globalCommands } = this.categorizeCommands(client);
		await Promise.all([
			guildCommands.length && CommandDeployer.deployCommands(RegisterType.Guild, guildCommands),
			globalCommands.length && CommandDeployer.deployCommands(RegisterType.Global, globalCommands),
		]);
	}

	public static async deleteCommands(registerType: RegisterType, commandIds: string[]): Promise<void> {
		await CommandDeployer.deleteCommands(registerType, commandIds);
	}

	private static categorizeCommands(client: ExtendedClient) {
		const guildCommands: (ContextMenu | SlashCommand)[] = [];
		const globalCommands: (ContextMenu | SlashCommand)[] = [];

		for (const commandCollection of [client.commands.slash, client.commands.context]) {
			for (const command of commandCollection.values()) {
				(command.registerType === RegisterType.Guild ? guildCommands : globalCommands).push(command);
			}
		}

		return { guildCommands, globalCommands };
	}
}
