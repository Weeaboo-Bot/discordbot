const { CommandoClient } = require('discord.js-commando');
const path = require('path');
const { Structures } = require('discord.js');
const {token,prefix,discord_owner_id,guild_log,dm_log,status_log, g} = require('./config');


//DEBUG
//const token = process.env.token;
//const prefix = process.env.prefix;
//const discord_owner_id = process.env.discord_owner_id;

const { fromNow } = require('discord.js-commando')
const { version } = require('./package')


const verificationLevels = ['None', 'Low', 'Medium', '(╯°□°）╯︵ ┻━┻', '┻━┻ ﾐヽ(ಠ益ಠ)ノ彡┻━┻']
const explicitContentFilters = ['None', 'Scan messages from those without a role', 'Scan all messages']



Structures.extend('Guild', function(Guild) {
  class MusicGuild extends Guild {
    constructor(client, data) {
      super(client, data);
      this.musicData = {
        queue: [],
        isPlaying: false,
        nowPlaying: null,
        songDispatcher: null,
        volume: 1
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
    //messageCacheMaxSize	= 50,
    disabledEvents: [
        'typingStart',
        'messageDelete',
        'messageUpdate',

        'userUpdate',

        'voiceStateUpdate',
        'guildMemberSpeaking'
    ]
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
      ['general', 'General']
  ])
  .registerDefaultGroups()

    .registerDefaultCommands({
        eval: false,
        prefix: false,
        commandState: false,
        ping: false,
        commands: false


    })
  .registerCommandsIn(path.join(__dirname, 'commands'))



client.on('reconnecting', () => {
    console.log('I am reconnecting now!');
}).on('resume', () => {
    console.log('Reconnected! I\'m back on track!');
}).on('disconnect', () => {
    console.log('Disconnected from the server... just thought I\'d let you know!');
})

/*
setInterval(function() {
	fetch("http://komugari.herokuapp.com");
}, 500000); // prevents sleeping
*/

client.once('ready', () => {
    client.user.setActivity('with you | ~help')

    var channel = client.channels.cache.get(status_log);
    const embed = new Discord.MessageEmbed()
        .setAuthor('Weaboo has (re)started!', client.user.displayAvatarURL({ format: 'png' }))
        .setColor('#727293')
        .setDescription(`•\u2000\Serving ${client.users.cache.size} users in ${client.guilds.cache.size} servers and ${client.channels.cache.size} channels!\n\•\u2000**Commands:** ${client.registry.commands.size}`)
        .setFooter(`v${version}`)
        .setTimestamp();
    channel.send({ embed });

    return console.log(`Weaboo is live and ready in ${client.guilds.cache.size} servers!`);
});

client.on('voiceStateUpdate', async (___, newState) => {
    if (
        newState.member.user.bot &&
        !newState.channelID &&
        newState.guild.musicData.songDispatcher &&
        newState.member.user.id == client.user.id
    ) {
        newState.guild.musicData.queue.length = 0;
        newState.guild.musicData.songDispatcher.end();
    }
});

client.on('guildCreate', guild => {
    var channel = client.channels.cache.get(guild_log);

    var online = guild.members.cache.filter(m => m.user.presence.status === "online").size;
    var bots = guild.members.cache.filter(m => m.user.bot).size;
    var highestRole = guild.roles.cache.sort((a, b) => a.position - b.position).map(role => role.toString()).slice(1).reverse()[0];

    var textChannels = guild.channels.cache.filter(c => c.type === 'text');
    var voiceChannels = guild.channels.cache.filter(c => c.type === 'voice');

    const embed = new Discord.MessageEmbed()
        .setAuthor(`Added to ${guild.name}!`, guild.iconURL())
        .setDescription(`Server infomation for **${guild.name}**`)
        .setColor('#78AEE8')
        .setThumbnail(guild.iconURL())
        .addField('❯\u2000\Information', `•\u2000\**ID:** ${guild.id}\n\•\u2000\**${guild.owner ? 'Owner' : 'Owner ID'}:** ${guild.owner ? `${guild.owner.user.tag} (${guild.owner.id})` : guild.ownerID}\n\•\u2000\**Created:** ${moment(guild.createdAt).format('MMMM Do YYYY')} \`(${fromNow(guild.createdAt)})\`\n\•\u2000\**Region:** ${guild.region}\n\•\u2000\**Verification:** ${verificationLevels[guild.verificationLevel]}\n\•\u2000\**Content Filter:** ${explicitContentFilters[guild.explicitContentFilter]}`)
        .addField('❯\u2000\Quantitative Statistics', `•\u2000\**Channels** [${guild.channels.size}]: ${textChannels.size} text - ${voiceChannels.size} voice\n\•\u2000\**Members** [${guild.memberCount}]: ${online} online - ${bots} bots\n\•\u2000\**Roles:** ${guild.roles.size}`, true)
        .addField('❯\u2000\Miscellaneous', `•\u2000\**Emojis:** ${guild.emojis.size}`, true)
        .setTimestamp()
        .setFooter(`(${client.guilds.cache.size})`);
    return channel.send({embed});
});

client.on('guildDelete', guild => {
    var channel = client.channels.cache.get(guild_log);

    var online = guild.members.cache.filter(m => m.user.presence.status === "online").size
    var bots = guild.members.cache.filter(m => m.user.bot).size
    var highestRole = guild.roles.cache.sort((a, b) => a.position - b.position).map(role => role.toString()).slice(1).reverse()[0]

    var textChannels = guild.channels.cache.filter(c => c.type === 'text');
    var voiceChannels = guild.channels.cache.filter(c => c.type === 'voice');

    const embed = new Discord.MessageEmbed()
        .setAuthor('Removed from a Server!', guild.iconURL())
        .setColor('#898276')
        .setThumbnail(guild.iconURL())
        .setDescription(`Server infomation for **${guild.name}**`)
        .addField('❯\u2000\Information', `•\u2000\**ID:** ${guild.id}\n\•\u2000\**${guild.owner ? 'Owner' : 'Owner ID'}:** ${guild.owner ? `${guild.owner.user.tag} (${guild.owner.id})` : guild.ownerID}\n\•\u2000\**Created:** ${moment(guild.createdAt).format('MMMM Do YYYY')} \`(${fromNow(guild.createdAt)})\`\n\•\u2000\**Region:** ${guild.region}\n\•\u2000\**Verification:** ${verificationLevels[guild.verificationLevel]}\n\•\u2000\**Content Filter:** ${explicitContentFilters[guild.explicitContentFilter]}`)
        .addField('❯\u2000\Quantitative Statistics', `•\u2000\**Channels** [${guild.channels.cache.size}]: ${textChannels.size} text - ${voiceChannels.size} voice\n\•\u2000\**Members** [${guild.memberCount}]: ${online} online - ${bots} bots\n\•\u2000\**Roles:** ${guild.roles.size}`, true)
        .addField('❯\u2000\Miscellaneous', `•\u2000\**Emojis:** ${guild.emojis.size}`, true)
        .setTimestamp()
        .setFooter(`(${client.guilds.cache.size})`);
    return channel.send({embed});
});


//removes bot's message if reacted with card thing
client.on("messageReactionAdd", async (messageReaction, user) => {
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

                            setTimeout(async function() {
                                await messageReaction.message.delete()
                            }, 1000);

                        }, 1000);

                    }, 1000);

                }, 1000);

            }, 1000);

        }, 1000);

        return null;
    }

    return null;
})


//basic message replies
client.on("message", async message => {
    if(message.author.bot) return undefined;

    if(message.channel.type == "dm") {
        if(message.content.startsWith('~')) return;
        var channel = client.channels.cache.get(dm_log);

        const embed = new Discord.MessageEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setDescription(message.content)
            .setColor('#D48AD8')
            .setTimestamp();
        return channel.send({embed});
    }

  //  if (!message.channel.(client.user.id).has('SEND_MESSAGES')) return undefined;


    if(message.content.toUpperCase().includes('PRESS F')) {
        message.react('🇫');
        return null;
    }

    if(message.content.toUpperCase().includes('NYA')) {
        message.react('🐱');
        return null;
    }

    if(message.content.toUpperCase().includes('BAKA')) {
        message.react('💢');
        return null;
    }

    return null;
});

process.on('unhandledRejection', err => {
    console.error('Uncaught Promise Error! \n' + err.stack);
});



client.login(token);