/* eslint-disable no-useless-escape */
/* eslint-disable max-nested-callbacks */
require("./helpers/extenders");
const WeabooClient = require('./models/WeabooClient');
const util = require("util"),
		fs = require("fs"),
		path = require('path'),
		readdir = util.promisify(fs.readdir),
		mongoose = require("mongoose");

const config = require("./config");
const { formatNumber } = require('./helpers/functions');
const { Intents, MessageEmbed } = require('discord.js');


const client = new WeabooClient({
	commandPrefix: config.prefix ,
	owner: config.owner.id,
	disableEveryone: true,
	unknownCommandResponse: false,
	ws: { intents: Intents.ALL },
	// messageCacheMaxSize	= 50,
});




client.registry
			.registerDefaultTypes()
			.registerGroups([
				['action', 'Action'],
				['anime', 'Anime'],
				['music', 'Music'],
				['fun', 'Fun'],
				['core', 'Core'],
				['info', 'Info'],
				['memes', 'Memes'],
				['moderation', 'Moe-Deration'],
				['nsfw', 'NSFW'],
				['utility', 'Utility'],
				['owner', 'Hidden + Owner'],
				['news', 'News'],
				['general', 'General'],
				['games', 'Games'],
				['video', 'Video Commands'],
				['loyal', 'Loyalty Program Commands'],
				['number', 'Number Commands'],
			])
			.registerDefaultGroups()
			
			.registerDefaultCommands({
				eval: false,
				prefix: false,
				commandState: false,
				ping: false,
				commands: false,
				webhook: false,
				
				
			})
			.registerCommandsIn(path.join(__dirname, 'commands'));



const init = async () => {
	// Then we load events, which will include our message and ready event.
	const evtFiles = await readdir("./events/");
	
	this.client.logger.log(`Loading a total of ${evtFiles.length} events.`, "log");
	evtFiles.forEach((file) => {
		const eventName = file.split(".")[0];
		this.client.logger.log(`Loading Event: ${eventName}`);
		const event = new (require(`./events/${file}`))(client);
		client.on(eventName, (...args) => event.run(...args));
		delete require.cache[require.resolve(`./events/${file}`)];
	});
	
	// connect to mongoose database
	mongoose.connect(this.client.config.mongoDB, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
		this.client.logger.log("Connected to the Mongodb database.", "log");
	}).catch((err) => {
		this.client.logger.log("Unable to connect to the Mongodb database. Error:"+err, "error");
	});
	
	const languages = require("./helpers/languages");
	client.translations = await languages();
};

client.on('ready', () => {
 // logger.log(`[READY] Logged in as ${client.user.tag}! ID: ${client.user.id}`);
	console.log('Ready');
	
	
	
});







// if there are errors, log them
client.on("disconnect", () => client.logger.log("Bot is disconnecting...", "warn"))
		.on("reconnecting", () => client.logger.log("Bot reconnecting...", "log"))
		.on("error", (e) => client.logger.log(e, "error"))
		.on("warn", (info) => client.logger.log(info, "warn"));

// if there is an unhandledRejection, log them
process.on("unhandledRejection", (err) => {
	console.error(err);
});

client.login(config.token);



