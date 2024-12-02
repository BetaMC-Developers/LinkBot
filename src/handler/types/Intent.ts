import { GatewayIntentBits } from "discord.js";

export const AutomaticIntents: any = 0;

/**
 * @see https://discord.com/developers/docs/topics/gateway#list-of-intents List of all Intents
 */
export const EventIntentMapping: Record<string, GatewayIntentBits[]> = {
	guildCreate: [GatewayIntentBits.Guilds],
	guildUpdate: [GatewayIntentBits.Guilds],
	guildDelete: [GatewayIntentBits.Guilds],
	guildRoleCreate: [GatewayIntentBits.Guilds],
	guildRoleUpdate: [GatewayIntentBits.Guilds],
	guildRoleDelete: [GatewayIntentBits.Guilds],
	channelCreate: [GatewayIntentBits.Guilds],
	channelUpdate: [GatewayIntentBits.Guilds],
	channelDelete: [GatewayIntentBits.Guilds],
	channelPinsUpdate: [GatewayIntentBits.Guilds],
	threadCreate: [GatewayIntentBits.Guilds],
	threadUpdate: [GatewayIntentBits.Guilds],
	threadDelete: [GatewayIntentBits.Guilds],
	threadListSync: [GatewayIntentBits.Guilds],
	threadMemberUpdate: [GatewayIntentBits.Guilds],
	threadMembersUpdate: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
	stageInstanceCreate: [GatewayIntentBits.Guilds],
	stageInstanceUpdate: [GatewayIntentBits.Guilds],
	stageInstanceDelete: [GatewayIntentBits.Guilds],
	guildMemberAdd: [GatewayIntentBits.GuildMembers],
	guildMemberUpdate: [GatewayIntentBits.GuildMembers],
	guildMemberRemove: [GatewayIntentBits.GuildMembers],
	guildAuditLogEntryCreate: [GatewayIntentBits.GuildModeration],
	guildBanAdd: [GatewayIntentBits.GuildModeration],
	guildBanRemove: [GatewayIntentBits.GuildModeration],
	guildEmojisUpdate: [GatewayIntentBits.GuildEmojisAndStickers],
	guildStickersUpdate: [GatewayIntentBits.GuildEmojisAndStickers],
	guildIntegrationsUpdate: [GatewayIntentBits.GuildIntegrations],
	integrationCreate: [GatewayIntentBits.GuildIntegrations],
	integrationUpdate: [GatewayIntentBits.GuildIntegrations],
	integrationDelete: [GatewayIntentBits.GuildIntegrations],
	webhooksUpdate: [GatewayIntentBits.GuildWebhooks],
	inviteCreate: [GatewayIntentBits.GuildInvites],
	inviteDelete: [GatewayIntentBits.GuildInvites],
	voiceStateUpdate: [GatewayIntentBits.GuildVoiceStates],
	presenceUpdate: [GatewayIntentBits.GuildPresences],
	messageCreate: [GatewayIntentBits.GuildMessages],
	messageUpdate: [GatewayIntentBits.GuildMessages],
	messageDelete: [GatewayIntentBits.GuildMessages],
	messageDeleteBulk: [GatewayIntentBits.GuildMessages],
	messageReactionAdd: [GatewayIntentBits.GuildMessageReactions],
	messageReactionRemove: [GatewayIntentBits.GuildMessageReactions],
	messageReactionRemoveAll: [GatewayIntentBits.GuildMessageReactions],
	messageReactionRemoveEmoji: [GatewayIntentBits.GuildMessageReactions],
	typingStart: [GatewayIntentBits.DirectMessageTyping],
	guildScheduledEventCreate: [GatewayIntentBits.GuildScheduledEvents],
	guildScheduledEventUpdate: [GatewayIntentBits.GuildScheduledEvents],
	guildScheduledEventDelete: [GatewayIntentBits.GuildScheduledEvents],
	guildScheduledEventUserAdd: [GatewayIntentBits.GuildScheduledEvents],
	guildScheduledEventUserRemove: [GatewayIntentBits.GuildScheduledEvents],
	autoModerationRuleCreate: [GatewayIntentBits.AutoModerationConfiguration],
	autoModerationRuleUpdate: [GatewayIntentBits.AutoModerationConfiguration],
	autoModerationRuleDelete: [GatewayIntentBits.AutoModerationConfiguration],
	autoModerationActionExecution: [GatewayIntentBits.AutoModerationExecution],
	messagePollVoteAdd: [GatewayIntentBits.GuildMessagePolls, GatewayIntentBits.DirectMessagePolls],
	messagePollVoteRemove: [GatewayIntentBits.GuildMessagePolls, GatewayIntentBits.DirectMessagePolls],
};
