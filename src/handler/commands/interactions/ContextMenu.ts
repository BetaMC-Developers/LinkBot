import type { ContextMenuCommandBuilder, ContextMenuCommandInteraction } from "discord.js";
import { RegisterType } from "../../types/RegisterType";
import { BaseCommand } from "../base/BaseCommand";

type ContextMenuExecutor = (interaction: ContextMenuCommandInteraction) => Promise<void>;

export class ContextMenu extends BaseCommand {
	public readonly registerType: RegisterType;

	public readonly data: ContextMenuCommandBuilder;

	public readonly execute: ContextMenuExecutor;

	public constructor(
		options: BaseCommand & {
			data: ContextMenuCommandBuilder;
			execute: ContextMenuExecutor;
			registerType?: RegisterType;
		},
	) {
		super(options);
		this.data = options.data;
		this.registerType = options.registerType ?? RegisterType.Guild;
		this.execute = options.execute;
		Object.assign(this, options);
	}
}
