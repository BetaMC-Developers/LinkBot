import process from "node:process";
import { fileURLToPath, URL } from "node:url";
import { API } from "@discordjs/core";
import { REST } from "discord.js";
import dotenv from "dotenv";
import logger from "./util/constants/logger.js";
import loadStructures from "./util/functions/loadStructures.js";
import { isCommand } from "./util/types/index.js";

dotenv.config();

const CONFIG = {
	token: process.env.TOKEN ?? "",
	appId: process.env.APP_ID ?? "",
};

const rest = new REST().setToken(CONFIG.token);

const api = new API(rest);

const commands = await loadStructures(fileURLToPath(new URL("commands", import.meta.url)), isCommand);
const commandData = commands.map((command) => command.data);

const result = await api.applicationCommands.bulkOverwriteGlobalCommands(CONFIG.appId, commandData);

logger.success(`Successfully registered ${result.length} commands`);
