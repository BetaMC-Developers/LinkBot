import type { AnySelectMenuInteraction } from "discord.js";

type SelectMenuExecutor = (
	interaction: AnySelectMenuInteraction,
	values: string[],
	uniqueIds: (string | null)[],
) => Promise<void>;

type SelectMenuData = {
	customId: string;
	disabled?: boolean;
	execute: SelectMenuExecutor;
};

export class SelectMenu {
	public readonly customId: string;

	public readonly disabled: boolean;

	public readonly execute: SelectMenuExecutor;

	public constructor({ customId, disabled = false, execute }: SelectMenuData) {
		this.customId = customId;
		this.disabled = disabled;
		this.execute = execute;
	}
}
