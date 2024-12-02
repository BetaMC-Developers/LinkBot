import type { ButtonStyle, EmbedBuilder, Interaction, Message } from "discord.js";

export enum PaginatorButtonType {
	First,
	Previous,
	Next,
	Last,
}

export type PaginatorSettings = {
	autoPageDisplay?: boolean;
	buttons?: {
		emoji?: string;
		label?: string;
		style?: ButtonStyle;
		type: PaginatorButtonType;
	}[];
	hideFirstLastButtons?: boolean;
	loopPages?: boolean;
	pages: EmbedBuilder[];
	restrictToAuthor?: boolean;
	showButtonsAfterTimeout?: boolean;
	timeout: number;
}

export type PaginatorSendOptions = {
	content?: string;
	context: Interaction | Message;
	ephemeral?: boolean;
	followUp?: boolean;
}
