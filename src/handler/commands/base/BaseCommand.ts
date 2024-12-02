export abstract class BaseCommand {
	public userCooldown?: number;

	public guildCooldown?: number;

	public globalCooldown?: number;

	public allowedUsers?: string[];

	public blockedUsers?: string[];

	public optionalAllowedUsers?: string[];

	public allowedChannels?: string[];

	public blockedChannels?: string[];

	public optionalAllowedChannels?: string[];

	public allowedCategories?: string[];

	public blockedCategories?: string[];

	public optionalAllowedCategories?: string[];

	public allowedGuilds?: string[];

	public blockedGuilds?: string[];

	public optionalAllowedGuilds?: string[];

	public allowedRoles?: string[];

	public blockedRoles?: string[];

	public optionalAllowedRoles?: string[];

	public restrictedToOwner?: boolean;

	public restrictedToNSFW?: boolean;

	public isDisabled?: boolean;

	protected constructor(args: Partial<BaseCommand> = {}) {
		Object.assign(this, args);
	}
}
