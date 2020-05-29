const { CommandoClient } = require('discord.js-commando');
const path = require('path');
const { Structures } = require('discord.js');
const {token,prefix,discord_owner_id,GUILDLOG,DMLOG,STATUSLOG, generalID} = require('./config');


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
    console.log(`Logged in as ${client.user.tag}! (${client.user.id})`);
    client.user.setActivity(`${prefix}help`, {
        type: 'WATCHING',
        url: 'https://github.com/sdoran35/discordbot'
    });

    client.channels.get(generalID).send('@everyone Weaboo Bot is Online and Ready!!')
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

client.on('guildMemberAdd', member => {
    // Send the message to a designated channel on a server:
    const channel = member.guild.channels.cache.find(ch => ch.name === 'general');

    // Do nothing if the channel wasn't found on this server
    if (!channel) return;
    // Send the message, mentioning the member
    channel.send(`Welcome to the server, ${member}\nPlease use the !help command to learn about our bot.\nPlease use the !roles command to update your server Roles`);
});




//basic message replies
client.on("message", async message => {
    if(message.author.bot) return undefined;

    if(message.channel.type == "dm") {
        if(message.content.startsWith('~')) return;
        var channel = client.channels.fetch(DMLOG, true);

        const embed = new Discord.MessageEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setDescription(message.content)
            .setColor('#D48AD8')
            .setTimestamp();
        return channel.send({embed});
    }

    if (!message.channel.permissionsFor(client.user.id).has('SEND_MESSAGES')) return undefined;


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