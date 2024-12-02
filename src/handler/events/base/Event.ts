import type { Events } from "discord.js";

type EventExecutor = (...args: any[]) => Promise<void>;

type EventData = {
	disabled?: boolean;
	execute: EventExecutor;
	name: Events;
	once?: boolean;
};

export class Event {
	public readonly name: string;

	public readonly once: boolean;

	public readonly disabled: boolean;

	public readonly execute: EventExecutor;

	public constructor({ name, once = false, disabled = false, execute }: EventData) {
		this.name = name;
		this.once = once;
		this.disabled = disabled;
		this.execute = execute;
	}
}
