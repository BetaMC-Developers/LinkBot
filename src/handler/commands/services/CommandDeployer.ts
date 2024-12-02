import type { ContextMenuCommandBuilder, REST, RouteLike, SlashCommandBuilder } from "discord.js";
import type { RegisterType } from "../../types/RegisterType";
import { LogManager } from "../../utils/LogManager";
import type { ContextMenu } from "../interactions/ContextMenu";
import type { SlashCommand } from "../interactions/SlashCommand";
import { ConfigManager } from "./ConfigManager";

export const CommandDeployer = {
	async deployCommands(registerType: RegisterType, commands: (ContextMenu | SlashCommand)[]): Promise<void> {
		const rest: REST | null = ConfigManager.setupREST();
		const route: RouteLike | null = ConfigManager.getRoute(registerType);

		if (!rest || !route) return;

		try {
			const data: (ContextMenuCommandBuilder | SlashCommandBuilder)[] = commands
				.map((command: ContextMenu | SlashCommand) => command.data)
				.filter(Boolean);
			await rest.put(route, { body: data });
			LogManager.log(`Successfully uploaded ${data.length} ${registerType} commands.`);
		} catch (error) {
			LogManager.logError("Error uploading commands.", error);
		}
	},

	async deleteCommands(registerType: RegisterType, commandIds: string[]): Promise<void> {
		const rest: REST | null = ConfigManager.setupREST();
		const route: string | null = ConfigManager.getRoute(registerType);

		if (!rest || !route) return;

		try {
			await Promise.all(
				commandIds.map(
					async (commandId: string): Promise<unknown> => rest.delete(`${route}/${commandId}` as RouteLike),
				),
			);
			LogManager.log(`Successfully deleted ${commandIds.length} ${registerType} commands.`);
		} catch (error) {
			LogManager.logError("Error deleting commands.", error);
		}
	},
};
