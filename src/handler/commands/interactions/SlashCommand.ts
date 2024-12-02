import type { AutocompleteInteraction, ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { RegisterType } from "../../types/RegisterType";
import { BaseCommand } from "../base/BaseCommand";

type SlashCommandExecutor = (interaction: ChatInputCommandInteraction) => Promise<void>;
type AutocompleteExecutor = (interaction: AutocompleteInteraction) => Promise<void>;

export class SlashCommand extends BaseCommand {
	public readonly registerType: RegisterType;

	public readonly data: SlashCommandBuilder;

	public readonly execute: SlashCommandExecutor;

	public readonly autocomplete?: AutocompleteExecutor;

	public constructor(
		options: BaseCommand & {
			autocomplete?: AutocompleteExecutor;
			data: SlashCommandBuilder;
			execute: SlashCommandExecutor;
			registerType?: RegisterType;
		},
	) {
		super(options);
		this.data = options.data;
		this.registerType = options.registerType ?? RegisterType.Guild;
		this.execute = options.execute;
		this.autocomplete = options.autocomplete;
	}
}
