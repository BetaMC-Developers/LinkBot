import process from "node:process";
import { fileURLToPath, URL } from "node:url";
import dotenv from "dotenv";
import { client } from "./util/constants/client.js";
import loadStructures from "./util/functions/loadStructures.js";
import { isButton, isCommand, isEvent, isModal, isSelectMenu } from "./util/types/index.js";

dotenv.config();

const CONFIG = {
	token: process.env.TOKEN ?? "",
};

const commands = await loadStructures(fileURLToPath(new URL("commands", import.meta.url)), isCommand);

for (const command of commands) {
	client.commands.set(command.data.name, command);
}

const events = await loadStructures(fileURLToPath(new URL("events", import.meta.url)), isEvent);

for (const event of events) {
	client[event.once ? "once" : "on"](event.name, async (...args) => event.execute(...args));
}

const buttons = await loadStructures(fileURLToPath(new URL("components/buttons", import.meta.url)), isButton);

for (const button of buttons) {
	client.buttons.set(button.customId, button);
}

const modals = await loadStructures(fileURLToPath(new URL("components/modals", import.meta.url)), isModal);

for (const modal of modals) {
	client.modals.set(modal.customId, modal);
}

const selectMenus = await loadStructures(
	fileURLToPath(new URL("components/selectMenus", import.meta.url)),
	isSelectMenu,
);

for (const selectMenu of selectMenus) {
	client.selectMenus.set(selectMenu.customId, selectMenu);
}

await client.login(CONFIG.token);
