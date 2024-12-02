import type { ButtonInteraction } from "discord.js";

type ButtonExecutor = (interaction: ButtonInteraction, uniqueId: string | null) => Promise<void>;

type ButtonData = {
	customId: string;
	disabled?: boolean;
	execute: ButtonExecutor;
};

export class Button {
	public readonly customId: string;

	public readonly disabled: boolean;

	public readonly execute: ButtonExecutor;

	public constructor({ customId, disabled = false, execute }: ButtonData) {
		this.customId = customId;
		this.disabled = disabled;
		this.execute = execute;
	}
}
