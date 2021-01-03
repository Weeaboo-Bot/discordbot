const { CommandoClient } = require('discord.js-commando');
const { WebhookClient, Collection, Structures } = require('discord.js');
const winston = require('winston');
const activities = require('../assets/json/activity');
const leaveMsgs = require('../assets/json/leave-messages');
const {
	DISCORD_WEBHOOK_ID,
	DISCORD_WEBHOOK_TOKEN,
	REPORT_LOG,
	JOIN_LEAVE_LOG,
} = require('../config');


Structures.extend('Guild', function(Guild) {
	class MusicGuild extends Guild {
		constructor(client, data) {
			super(client, data);
			this.musicData = {
				queue: [],
				isPlaying: false,
				nowPlaying: null,
				songDispatcher: null,
				volume: 0.10,
			};
		}
	}
	return MusicGuild;
});

module.exports = class WeabooClient extends CommandoClient {
	constructor(options) {
		super(options);

		this.logger = winston.createLogger({
			transports: [new winston.transports.Console()],
			format: winston.format.combine(
				winston.format.timestamp({ format: 'MM/DD/YYYY HH:mm:ss' }),
				winston.format.printf(log => `[${log.timestamp}] [${log.level.toUpperCase()}]: ${log.message}`),
			),
		});
		this.webhook = new WebhookClient(DISCORD_WEBHOOK_ID, DISCORD_WEBHOOK_TOKEN, { disableMentions: 'everyone' });
		this.games = new Collection();
		this.phone = new Collection();
		this.activities = activities;
		this.leaveMessages = leaveMsgs;
	}

	inPhoneCall(channel) {
		return this.phone.some(call => call.origin.id === channel.id || call.recipient.id === channel.id);
	}

	isBlockedFromPhone(origin, recipient, caller) {
		return (recipient.guild && recipient.topic.includes(`<weaboo:phone:block:${origin.id}>`))
				|| (recipient.guild && recipient.topic.includes(`<weaboo:phone:block:${caller.id}>`))
				|| (origin.guild && recipient.guild && recipient.topic.includes(`<weaboo:phone:block:${origin.guild.id}>`))
				|| (origin.guild && origin.topic.includes(`<weaboo:phone:block:${recipient.id}>`))
				|| (origin.guild && recipient.guild && origin.topic.includes(`<weaboo:phone:block:${recipient.guild.id}>`))
				|| (origin.guild && origin.topic.includes(`<weaboo:phone:block:${caller.id}>`));
	}


	fetchReportChannel() {
		if (!REPORT_LOG) return null;
		return this.channels.fetch(REPORT_LOG);
	}

	fetchJoinLeaveChannel() {
		if (JOIN_LEAVE_LOG) return null;
		return this.channels.fetch(JOIN_LEAVE_LOG);
	}
};
