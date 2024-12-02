import { Collection } from "discord.js";
import type { ContextMenu } from "../commands/interactions/ContextMenu";
import type { SlashCommand } from "../commands/interactions/SlashCommand";
import type { PrefixCommand } from "../commands/prefix/PrefixCommand";

export type CommandCollections = {
	context: Collection<string, ContextMenu>;
	prefix: Collection<string, PrefixCommand>;
	prefixAliases: Collection<string, string>;
	slash: Collection<string, SlashCommand>;
}

export type CommandCooldownCollections = {
	global: Collection<string, string>;
	guild: Collection<string, string>;
	user: Collection<string, string>;
}

export const emptyCommandCollections: CommandCollections = {
	slash: new Collection<string, SlashCommand>(),
	context: new Collection<string, ContextMenu>(),
	prefix: new Collection<string, PrefixCommand>(),
	prefixAliases: new Collection<string, string>(),
};

export const emptyCommandCooldownCollections: CommandCooldownCollections = {
	user: new Collection<string, string>(),
	guild: new Collection<string, string>(),
	global: new Collection<string, string>(),
};
