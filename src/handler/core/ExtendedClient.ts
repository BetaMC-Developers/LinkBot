import process from "node:process";
import { Client, type GatewayIntentBits, IntentsBitField } from "discord.js";
import mysql from "mysql2/promise";
import config from "../../config";
import { CommandManager } from "../commands/CommandManager";
import { ComponentManager } from "../components/ComponentManager";
import { EventManager } from "../events/EventManager";
import {
	type CommandCollections,
	type CommandCooldownCollections,
	emptyCommandCollections,
	emptyCommandCooldownCollections,
} from "../types/CommandCollections";
import { type ComponentCollections, emptyComponentCollections } from "../types/ComponentCollections";
import type { ExtendedClientOptions } from "../types/ExtendedClientOptions";
import { Features } from "../types/Features";
import { AutomaticIntents, EventIntentMapping } from "../types/Intent";
import type { RegisterType } from "../types/RegisterType";
import { Gray, Green } from "../types/TerminalColor";
import { LogManager } from "../utils/LogManager";

export class ExtendedClient extends Client {
	public events: string[] = [];

	public commands: CommandCollections = emptyCommandCollections;

	public commandCooldowns: CommandCooldownCollections = emptyCommandCooldownCollections;

	public components: ComponentCollections = emptyComponentCollections;

	private readonly features: Features[];

	private readonly disabledFeatures?: Features[];

	private readonly uploadCommands: boolean;

	private readonly startupTime: number = Date.now();

	private dbConnection?: mysql.Connection;

	public constructor(options: ExtendedClientOptions) {
		super(options);
		this.features = options.features;
		this.disabledFeatures = options.disabledFeatures;
		this.uploadCommands = options.uploadCommands;
	}

	public override async login(token?: string): Promise<string> {
		if (!token) {
			LogManager.logError(
				`Bot token is undefined! ${Gray("Please provide a valid token in the environment variables.")}`,
			);
			await this.shutdown();
		}

		try {
			await this.initializeFeatures();
			await this.connectToDatabase();
			const result: string = await super.login(token);
			LogManager.logDefault(
				`\n  ${Green(this.user?.tag ?? "Unknown User")}  ${Gray("ready in")} ${Date.now() - this.startupTime}ms\n`,
			);
			return result;
		} catch (error: unknown) {
			LogManager.logError("Failed to connect to the bot", error);
			await this.shutdown();
			return "";
		}
	}

	public async reloadEvents(): Promise<void> {
		await EventManager.reloadEvents(this);
	}

	public async reloadCommands(): Promise<void> {
		if (
			this.isEnabledFeature(Features.SlashCommands) ||
			this.isEnabledFeature(Features.ContextMenus) ||
			this.isEnabledFeature(Features.PrefixCommands)
		)
			await CommandManager.reloadCommands(this);
	}

	public async reloadComponents(): Promise<void> {
		if (
			this.isEnabledFeature(Features.Buttons) ||
			this.isEnabledFeature(Features.SelectMenus) ||
			this.isEnabledFeature(Features.Modals)
		)
			await ComponentManager.reloadComponents(this);
	}

	public async deleteCommand(registerType: RegisterType, commandId: string): Promise<void> {
		await CommandManager.deleteCommands(registerType, [commandId]);
	}

	public async deleteCommands(registerType: RegisterType, commandIds: string[]): Promise<void> {
		await CommandManager.deleteCommands(registerType, commandIds);
	}

	private async initializeFeatures(): Promise<void> {
		await EventManager.registerEvents(this);
		if (this.options.intents.bitfield === AutomaticIntents) this.assignIntents();
		if (
			this.isEnabledFeature(Features.SlashCommands) ||
			this.isEnabledFeature(Features.ContextMenus) ||
			this.isEnabledFeature(Features.PrefixCommands)
		) {
			await CommandManager.registerCommands(this);
			if (this.uploadCommands) await CommandManager.deployCommands(this);
		}

		if (
			this.isEnabledFeature(Features.Buttons) ||
			this.isEnabledFeature(Features.SelectMenus) ||
			this.isEnabledFeature(Features.Modals)
		) {
			await ComponentManager.registerComponents(this);
		}
	}

	public isEnabledFeature(feature: Features): boolean {
		return (
			(this.features.includes(feature) || this.features.includes(Features.All)) &&
			!this.disabledFeatures?.includes(feature)
		);
	}

	private assignIntents(): void {
		const intentBitField: IntentsBitField = new IntentsBitField();

		for (const event of this.events) {
			const intents: GatewayIntentBits[] = EventIntentMapping[event];
			if (intents) {
				intentBitField.add(...intents);
			}
		}

		intentBitField.add(...config.defaultIntents);
		this.options.intents = intentBitField;
	}

	public async connectToDatabase(): Promise<void> {
		try {
			this.dbConnection = await mysql.createConnection({
				host: process.env.DB_HOST,
				user: process.env.DB_USER,
				password: process.env.DB_PASS,
				database: process.env.DB_NAME,
				port: Number(process.env.DB_PORT),
			});
			LogManager.logDefault("Database connected successfully.");
		} catch (error) {
			LogManager.logError("Failed to connect to the database", error);
			throw error;
		}
	}

	public async queryDatabase(query: string, params: any[] = []): Promise<any> {
		if (!this.dbConnection) {
			throw new Error("Database connection is not initialized.");
		}

		const [results] = await this.dbConnection.execute(query, params);
		return results;
	}

	private async shutdown(): Promise<void> {
		try {
			await this.destroy();
		} catch (error) {
			LogManager.logError("Error during shutdown", error);
		} finally {
			process.exit(0);
		}
	}
}
