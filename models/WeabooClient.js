const { CommandoClient } = require('discord.js-commando');
const { Collection, MessageEmbed} = require('discord.js');

const util = require("util"),
		path = require("path"),
		moment = require("moment");

moment.relativeTimeThreshold("s", 60);
moment.relativeTimeThreshold("ss", 5);
moment.relativeTimeThreshold("m", 60);
moment.relativeTimeThreshold("h", 60);
moment.relativeTimeThreshold("d", 24);
moment.relativeTimeThreshold("M", 12);



class WeabooClient extends CommandoClient {
	
	
	constructor (options) {
		super(options);
		this.config = require("../config"); // Load the config file
		this.customEmojis = require("../emojis.json"); // load the bot's emojis
		this.logger = require("../helpers/logger"); // Load the logger file
		this.wait = util.promisify(setTimeout); // client.wait(1000) - Wait 1 second
		this.functions = require("../helpers/functions"); // Load the functions file
		// this.guildsData = require("../models/Guild"); // Guild mongoose model
		// this.usersData = require("../models/User"); // User mongoose model
		// this.membersData = require("../models/Member"); // Member mongoose model
		// this.logs = require("../models/Log"); // Log mongoose model
		// this.games = new Collection();
		// this.databaseCache = {};
		// this.databaseCache.users = new Collection();
		// this.databaseCache.guilds = new Collection();
		// this.databaseCache.members = new Collection();
		//
		// this.databaseCache.usersReminds = new Collection(); // members with active reminds
		// this.databaseCache.mutedUsers = new Collection(); // members who are currently muted
		
		
		this.musicData = {
			queue: [],
			isPlaying: false,
			nowPlaying: null,
			songDispatcher: null,
			volume: 1,
		};
		
	
		

	}
	
	onError(err, message, args, fromPattern, result) { // eslint-disable-line no-unused-vars
		console.error(err);
		const embed = new MessageEmbed()
				.setColor('RED')
				.setTimestamp()
				.setTitle('Please report this on our Discord server https://lenoxbot.com/discord')
				.setDescription(`StackTrace: \n\`\`\`${err.stack}\`\`\``)
				.addField('Command:', `${message.content.split(' ').join(' ')}`);
		
		return message.reply({ embed });
	}
	
	get defaultLanguage(){
		return this.config.languages.find((language) => language.default).name;
	}
	
	translate(key, args, locale){
		if(!locale) locale = this.defaultLanguage;
		const language = this.translations.get(locale);
		if (!language) throw "Invalid language set in data.";
		return language(key, args);
	}
	
	printDate(date, format, locale){
		if(!locale) locale = this.defaultLanguage;
		const languageData = this.config.languages.find((language) => language.name === locale || language.aliases.includes(locale));
		if(!format) format = languageData.defaultMomentFormat;
		return moment(new Date(date))
				.locale(languageData.moment)
				.format(format);
	}
	
	convertTime(time, type, noPrefix, locale){
		if(!type) time = "to";
		if(!locale) locale = this.defaultLanguage;
		const languageData = this.config.languages.find((language) => language.name === locale || language.aliases.includes(locale));
		const m = moment(time)
				.locale(languageData.moment);
		return (type === "to" ? m.toNow(noPrefix) : m.fromNow(noPrefix));
	}
	
	
	
	
	
	
	
	
	
}

module.exports = WeabooClient;