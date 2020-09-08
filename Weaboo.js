/* eslint-disable no-useless-escape */
/* eslint-disable max-nested-callbacks */
require("./helpers/extenders");
const clipboard = require('clipboardy');
const Client = require('./models/WeabooClient');
const util = require("util"),
		fs = require("fs"),
		path = require('path'),
		readdir = util.promisify(fs.readdir),
		mongoose = require("mongoose"),
		logger = require('discordjs-logger'),
		custom_log = require('./helpers/logger');

const config = require("./config");
const { formatNumber } = require('./helpers/functions');
const { Intents, MessageEmbed } = require('discord.js');


const client = new Client({
  partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
	commandPrefix: '%' ,
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




const dbConnect = () => {
	// connect to mongoose database
	mongoose.connect(config.mongoDB, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
		console.log("Connected to the Mongodb database.", "log");
	}).catch((err) => {
		console.log("Unable to connect to the Mongodb database. Error:"+err, "error");
	});
};



const init = async (res) => {
	
	// Search for all commands
	const directories = await readdir("./commands/");
	custom_log.log(`Loading a total of ${directories.length} categories.`, 'success');
	for (const dir of directories) {
		const commands = await readdir("./commands/"+dir+"/");
		custom_log.log(`Loading a total of ${commands.length} commands in ${dir}`, 'success');
		commands.filter((cmd) => cmd.split(".").pop() === "js").forEach((cmd) => {
			
			custom_log.log(`Loading Command: ${cmd}`,'output');
			
		});
	}
	
	
	// Then we load events, which will include our message and ready event.
	const evtFiles = await readdir("./events/");
	custom_log.log(`Loading a total of ${evtFiles.length} events.`, 'success');
	evtFiles.forEach((file) => {
		const eventName = file.split(".")[0];
		custom_log.log(`Loading Event: ${eventName}`,'output');
	
	});
	// const languages = require("./helpers/languages");
	// client.translations = await languages();
	dbConnect();
	
	
	

};

client.on('ready', () => {
 
	
	init();
	
	console.log(`[READY] Logged in as ${client.user.tag}! ID: ${client.user.id}`);
	custom_log.log('hello','twitch');
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

logger.all(client);
client.login(config.token);



