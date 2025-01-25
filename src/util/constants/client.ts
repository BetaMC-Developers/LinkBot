import type { ClientOptions } from "discord.js";
import { Client, Collection } from "discord.js";
import type { Button, Command, Modal, SelectMenu } from "../types/index.js";
import { intentsArray } from "./intents.js";
import logger from "./logger.js";

export class CustomClient extends Client {
	public commands: Collection<string, Command>;

	public buttons: Collection<string, Button>;

	public modals: Collection<string, Modal>;

	public selectMenus: Collection<string, SelectMenu>;

	public logger = logger;

	public constructor(options: ClientOptions) {
		super(options);

		this.commands = new Collection<string, Command>();
		this.buttons = new Collection<string, Button>();
		this.modals = new Collection<string, Modal>();
		this.selectMenus = new Collection<string, SelectMenu>();
	}
}

export const client = new CustomClient({ intents: intentsArray });
