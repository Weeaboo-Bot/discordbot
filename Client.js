const { CommandoClient } = require('discord.js-commando');
const Collection = require('@discordjs/collection');

module.exports = class WeabooClient extends CommandoClient {
	constructor(options) {
		super(options);

		this.games = new Collection();
		this.memes = new Collection();
	}
};