const { CommandoClient } = require('discord.js-commando');
const path = require('path');
const {token,prefix} = require('./config/discord-config.json');

const client = new CommandoClient({
  commandPrefix: prefix,
  owner: '106089884585861120',
 
});

client.registry
  .registerDefaultTypes()
  .registerGroups([
    ['admin', 'Admin Commands'],
    ['general', 'General Commands'],
    ['music', 'Music Bot Commands'],
    ['roles', 'Role Commands'],
    ['channels', 'Channel Commands'],
    ['members', 'Member Commands']
  ])
  .registerDefaultGroups()
  .registerDefaultCommands({
    
    ping: false
  })
  .registerCommandsIn(path.join(__dirname, 'commands'));


  client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}! (${client.user.id})`);
    client.user.setActivity('with Commando');
  });
  
  client.on('error', console.error);

  client.login(token);