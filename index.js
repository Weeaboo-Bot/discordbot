/* eslint-disable no-useless-escape */
/* eslint-disable max-nested-callbacks */
const { CommandoClient } = require('discord.js-commando');
const path = require('path');
const { Structures } = require('discord.js');
const moment = require('moment');
const { token, prefix, discord_owner_id, guild_log, dm_log, status_log,audit_log } = require('./config');

// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
const firebase = require('firebase/app');

// Add the Firebase products that you want to use
require('firebase/auth');
require('firebase/firestore');

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
	apiKey: 'AIzaSyAZRhm4sxmNqlgNGxGiRGgT2Iy0u0y_dL0',
	authDomain: 'weaboo-bot-b5f7a.firebaseapp.com',
	databaseURL: 'https://weaboo-bot-b5f7a.firebaseio.com',
	projectId: 'weaboo-bot-b5f7a',
	storageBucket: 'weaboo-bot-b5f7a.appspot.com',
	messagingSenderId: '740571758465',
	appId: '1:740571758465:web:5a9aa0592de50622df3280',
	measurementId: 'G-V3Y6073RZH',
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

module.exports = {firebase};

// DEBUG
// const token = process.env.token;
// const prefix = process.env.prefix;
// const discord_owner_id = process.env.discord_owner_id;

const { fromNow } = require('discord.js-commando');
const { version } = require('./package');


const verificationLevels = ['None', 'Low', 'Medium', '(╯°□°）╯︵ ┻━┻', '┻━┻ ﾐヽ(ಠ益ಠ)ノ彡┻━┻'];
const explicitContentFilters = ['None', 'Scan messages from those without a role', 'Scan all messages'];


Structures.extend('Guild', function(Guild) {
	class MusicGuild extends Guild {
		constructor(client, data) {
			super(client, data);
			this.musicData = {
				queue: [],
				isPlaying: false,
				nowPlaying: null,
				songDispatcher: null,
				volume: 1,
			};

		}
	}
	return MusicGuild;
});


const client = new CommandoClient({
	commandPrefix: prefix,
	owner: discord_owner_id,
	disableEveryone: true,
	unknownCommandResponse: false,
	// messageCacheMaxSize	= 50,
	disabledEvents: [
		'typingStart',
		'messageDelete',
		'messageUpdate',

		'userUpdate',

		'voiceStateUpdate',
		'guildMemberSpeaking',
	],
});
const Discord = require('discord.js');

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
	])
	.registerDefaultGroups()

	.registerDefaultCommands({
		eval: false,
		prefix: false,
		commandState: false,
		ping: false,
		commands: false,


	})
	.registerCommandsIn(path.join(__dirname, 'commands'));


client.on('reconnecting', () => {
	console.log('I am reconnecting now!');
}).on('resume', () => {
	console.log('Reconnected! I\'m back on track!');
}).on('disconnect', () => {
	console.log('Disconnected from the server... just thought I\'d let you know!');
});

/*
setInterval(function() {
	fetch("http://komugari.herokuapp.com");
}, 500000); // prevents sleeping
*/

client.once('ready', () => {


	client.user.setActivity('TESTING',{
		name:'Watching for commands!',
		url: 'https://seanwdoran.engineer/discord',
		type: 'PLAYING'
	}).then(res => {

		return res;
	})
		.catch(function(err) {

			return err;
		});

	const channel = client.channels.cache.get(status_log);
	const embed = new Discord.MessageEmbed()
		.setAuthor('Weaboo has (re)started!', client.user.displayAvatarURL({ format: 'png' }))
		.setColor('#727293')
		.setDescription(`•\u2000\Serving ${client.users.cache.size} users in ${client.guilds.cache.size} servers and ${client.channels.cache.size} channels!\n\u2000**Commands:** ${client.registry.commands.size}`)
		.setFooter(`v${version}`)
		.setTimestamp();
	channel.send({ embed });

	return console.log(`Weaboo is live and ready in ${client.guilds.cache.size} servers!`);
});

client.on('commandCancel', () => {
	console.log('Command Cancelled!');
});


client.on('voiceStateUpdate', async (___, newState) => {
	if (
		newState.member.user.bot &&
        !newState.channelID &&
        newState.guild.musicData.songDispatcher &&
        newState.member.user.id === client.user.id
	) {
		newState.guild.musicData.queue.length = 0;
		newState.guild.musicData.songDispatcher.end();
	}
});

client.on('guildCreate', guild => {
	const channel = client.channels.cache.get(guild_log);

	const online = guild.members.cache.filter(m => m.user.presence.status === 'online').size;
	const bots = guild.members.cache.filter(m => m.user.bot).size;

	const textChannels = guild.channels.cache.filter(c => c.type === 'text');
	const voiceChannels = guild.channels.cache.filter(c => c.type === 'voice');

	const embed = new Discord.MessageEmbed()
		.setAuthor(`Added to ${guild.name}!`, guild.iconURL())
		.setDescription(`Server infomation for **${guild.name}**`)
		.setColor('#78AEE8')
		.setThumbnail(guild.iconURL())
		.addField('❯\u2000\Information', `•\u2000\**ID:** ${guild.id}\n\u2000\**${guild.owner ? 'Owner' : 'Owner ID'}:** ${guild.owner ? `${guild.owner.user.tag} (${guild.owner.id})` : guild.ownerID}\n\u2000\**Created:** ${moment(guild.createdAt).format('MMMM Do YYYY')} \`(${fromNow(guild.createdAt)})\`\n\u2000\**Region:** ${guild.region}\n\u2000\**Verification:** ${verificationLevels[guild.verificationLevel]}\n\u2000\**Content Filter:** ${explicitContentFilters[guild.explicitContentFilter]}`)
		.addField('❯\u2000\Quantitative Statistics', `•\u2000\**Channels** [${guild.channels.cache.size}]: ${textChannels.size} text - ${voiceChannels.size} voice\n\u2000\**Members** [${guild.memberCount}]: ${online} online - ${bots} bots\n\u2000\**Roles:** ${guild.roles.cache.size}`, true)
		.addField('❯\u2000\Miscellaneous', `•\u2000\**Emojis:** ${guild.emojis.cache.size}`, true)
		.setTimestamp()
		.setFooter(`(${client.guilds.cache.size})`);
	return channel.send({ embed });
});

client.on('guildDelete', guild => {
	const channel = client.channels.cache.get(guild_log);

	const online = guild.members.cache.filter(m => m.user.presence.status === 'online').size;
	const bots = guild.members.cache.filter(m => m.user.bot).size;

	const textChannels = guild.channels.cache.filter(c => c.type === 'text');
	const voiceChannels = guild.channels.cache.filter(c => c.type === 'voice');

	const embed = new Discord.MessageEmbed()
		.setAuthor('Removed from a Server!', guild.iconURL())
		.setColor('#898276')
		.setThumbnail(guild.iconURL())
		.setDescription(`Server infomation for **${guild.name}**`)
		.addField('❯\u2000\Information', `•\u2000\**ID:** ${guild.id}\n\u2000\**${guild.owner ? 'Owner' : 'Owner ID'}:** ${guild.owner ? `${guild.owner.user.tag} (${guild.owner.id})` : guild.ownerID}\n\u2000\**Created:** ${moment(guild.createdAt).format('MMMM Do YYYY')} \`(${fromNow(guild.createdAt)})\`\n\u2000\**Region:** ${guild.region}\n\u2000\**Verification:** ${verificationLevels[guild.verificationLevel]}\n\u2000\**Content Filter:** ${explicitContentFilters[guild.explicitContentFilter]}`)
		.addField('❯\u2000\Quantitative Statistics', `•\u2000\**Channels** [${guild.channels.cache.size}]: ${textChannels.size} text - ${voiceChannels.size} voice\n\u2000\**Members** [${guild.memberCount}]: ${online} online - ${bots} bots\n\u2000\**Roles:** ${guild.roles.size}`, true)
		.addField('❯\u2000\Miscellaneous', `•\u2000\**Emojis:** ${guild.emojis.size}`, true)
		.setTimestamp()
		.setFooter(`(${client.guilds.cache.size})`);
	return channel.send({ embed });
});


// removes bot's message if reacted with card thing
client.on('messageReactionAdd', async (messageReaction, user) => {
	if(messageReaction.message.author.id !== client.user.id) return undefined;
	if(user.bot) return undefined;
	if(messageReaction.emoji == '🎴') {

		setTimeout(async function() {
			await messageReaction.message.edit('5⃣');

			setTimeout(async function() {
				await messageReaction.message.edit('4⃣');

				setTimeout(async function() {
					await messageReaction.message.edit('3⃣');

					setTimeout(async function() {
						await messageReaction.message.edit('2⃣');

						setTimeout(async function() {
							await messageReaction.message.edit('1⃣');

							// eslint-disable-next-line max-nested-callbacks
							setTimeout(async function() {
								await messageReaction.message.delete();
							}, 1000);

						}, 1000);

					}, 1000);

				}, 1000);

			}, 1000);

		}, 1000);

		return null;
	}

	return null;
});

client.on('messageDelete', async message => {
	// ignore direct messages
	if (!message.guild) return;
	const fetchedLogs = await message.guild.fetchAuditLogs({
		limit: 1,
		type: 'MESSAGE_DELETE',
	});
	// Since we only have 1 audit log entry in this collection, we can simply grab the first one
	const deletionLog = fetchedLogs.entries.first();
	
	// Let's perform a sanity check here and make sure we got *something*
	if (!deletionLog) return console.log(`A message by ${message.author.tag} was deleted, but no relevant audit logs were found.`);
	
	// We now grab the user object of the person who deleted the message
	// Let us also grab the target of this action to double check things
	const { executor, target } = deletionLog;
	
	
	// And now we can update our output with a bit more information
	// We will also run a check to make sure the log we got was for the same author's message
	if (target.id === message.author.id) {
		
		const channel = client.channels.cache.get(audit_log);
		const embed = new Discord.MessageEmbed()
				.setTitle('Audit Event')
				.setColor('#727293')
				.addField('Audit Event Name', 'Message Deleted')
				.addField('Member',message.author.tag)
				.addField('Delete Event',executor.tag)
				.setFooter(`v${version}`)
				.setTimestamp();
		channel.send({ embed });
		console.log(`A message by ${message.author.tag} was deleted by ${executor.tag}.`);
	}	else {
		const channel = client.channels.cache.get(audit_log);
		const embed = new Discord.MessageEmbed()
				.setTitle('Audit Event')
				.setColor('#727293')
				.addField('Audit Event Name', 'Message Deleted')
				.addField('Member','Member is Unkown')
				.addField('Delete Event','Member is Unkown')
				.setFooter(`v${version}`)
				.setTimestamp();
		channel.send({ embed });
		console.log(`A message by ${message.author.tag} was deleted, but we don't know by who.`);
	}
});


// basic message replies
client.on('message', async message => {
	if(message.author.bot) return undefined;

	if(message.channel.type == 'dm') {
		if(message.content.startsWith('~')) return;
		const channel = client.channels.cache.get(dm_log);

		const embed = new Discord.MessageEmbed()
			.setAuthor(message.author.tag, message.author.displayAvatarURL())
			.setDescription(message.content)
			.setColor('#D48AD8')
			.setTimestamp();
		return channel.send({ embed });
	}

	//  if (!message.channel.(client.user.id).has('SEND_MESSAGES')) return undefined;


	if(message.content.toUpperCase().includes('PRESS F')) {
		await message.react('🇫');
		return null;
	}

	if(message.content.toUpperCase().includes('NYA')) {
		await message.react('🐱');
		return null;
	}

	if(message.content.toUpperCase().includes('BAKA')) {
		await message.react('💢');
		return null;
	}

	return null;
});

process.on('unhandledRejection', err => {
	console.error('Uncaught Promise Error! \n' + err.stack);
});


client.login(token);

