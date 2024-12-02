import type { Message } from "discord.js";
import { BaseCommand } from "../base/BaseCommand";

type PrefixCommandExecutor = (message: Message) => Promise<void>;

export class PrefixCommand extends BaseCommand {
	public readonly name: string;

	public readonly aliases?: string[];

	// readonly permissions?: string[];
	public readonly execute: PrefixCommandExecutor;

	public constructor(
		options: BaseCommand & {
			aliases?: string[];
			// permissions?: string[];
			// pingable?: boolean;
			execute: PrefixCommandExecutor;
			name: string;
		},
	) {
		super(options);
		this.name = options.name;
		this.aliases = options.aliases;
		// this.permissions = options.permissions;
		this.execute = options.execute;
	}
}
