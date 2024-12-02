import type { ModalSubmitFields, ModalSubmitInteraction } from "discord.js";

type ModalExecutor = (interaction: ModalSubmitInteraction, fields: ModalSubmitFields) => Promise<void>;

type ModalData = {
	customId: string;
	disabled?: boolean;
	execute: ModalExecutor;
};

export class Modal {
	public readonly customId: string;

	public readonly disabled: boolean;

	public readonly execute: ModalExecutor;

	public constructor({ customId, disabled = false, execute }: ModalData) {
		this.customId = customId;
		this.disabled = disabled;
		this.execute = execute;
	}
}
