const { CommandoClient } = require('discord.js-commando');
const Collection = require('@discordjs/collection');

module.exports = class WeabooClient extends CommandoClient {
	constructor(options) {
		super(options);

		this.games = new Collection();
		this.memes = new Collection();
		this.phones = new Collection();
		
		this.databaseCache = {};
		this.databaseCache.users = new Collection();
		this.databaseCache.guilds = new Collection();
		this.databaseCache.members = new Collection();
		
		this.databaseCache.usersReminds = new Collection(); // members with active reminds
		this.databaseCache.mutedUsers = new Collection(); // members who are currently muted
	}
};