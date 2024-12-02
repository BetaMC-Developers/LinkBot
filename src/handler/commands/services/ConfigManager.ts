import process from "node:process";
import { REST, type RouteLike, Routes } from "discord.js";
import { RegisterType } from "../../types/RegisterType";
import { LogManager } from "../../utils/LogManager";

export const ConfigManager = {
	setupREST(): REST | null {
		const { CLIENT_TOKEN } = process.env;
		if (!CLIENT_TOKEN) {
			LogManager.logError("CLIENT_TOKEN is missing. Ensure it is set in the environment.");
			return null;
		}

		return new REST({ version: "10" }).setToken(CLIENT_TOKEN);
	},

	getRoute(registerType: RegisterType): RouteLike | null {
		const { CLIENT_ID, GUILD_ID } = process.env;
		if (!CLIENT_ID) {
			LogManager.logError("CLIENT_ID is missing. Ensure it is set in the environment.");
			return null;
		}

		if (registerType === RegisterType.Guild && !GUILD_ID) {
			LogManager.logError("GUILD_ID is required for guild commands but is missing.");
			return null;
		}

		return registerType === RegisterType.Guild
			? Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID!)
			: Routes.applicationCommands(CLIENT_ID);
	},
};
