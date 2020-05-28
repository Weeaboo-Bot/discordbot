const { CommandoClient } = require('discord.js-commando');
const path = require('path');
const { Structures } = require('discord.js');
const {token,prefix,discord_owner_id} = require('./config/config.json');



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
 
});

client.registry
  .registerDefaultTypes()
  .registerGroups([
    ['admin', 'Admin Commands'],
    ['general', 'General Commands'],
    ['music', 'Music Bot Commands'],
    ['roles', 'Role Commands'],
    ['channels', 'Channel Commands'],
    ['members', 'Member Commands'],
    ['roles', 'Admin Role Commands'],
    ['members', 'Admin Member Commands'],
    ['news', 'News Commands'],
    ['other', 'Other Commands']
  ])
  .registerDefaultGroups()
  .registerDefaultCommands({
    eval: false,
    prefix: false,
    commandState: false,
    ping: false
  })
  .registerCommandsIn(path.join(__dirname, 'commands'))
  


  client.once('ready', () => {
    console.log('Ready!');
    client.user.setActivity(`${prefix}help`, {
      type: 'WATCHING',
      url: 'https://github.com/sdoran35/discordbot'
    });
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
    const channel = member.guild.channels.cache.find(ch => ch.name === 'general'); // change this to the channel name you want to send the greeting to
    if (!channel) return;
    channel.send(`Welcome ${member}!`);
  });
  
  client.login(token);