const config = require('./config');
const Discord = require('discord.js');
const Client = require('./structures/Client');

global.__basedir = __dirname;

// Client setup
const intents = new Discord.Intents();
intents.add(
    'GUILD_PRESENCES',
    'GUILD_MEMBERS',
    'GUILDS',
    'GUILD_VOICE_STATES',
    'GUILD_MESSAGES',
    'GUILD_MESSAGE_REACTIONS',
);

const client = new Client(config, {
    intents: intents,
    commandPrefix: '$',
    owner: config.discord.DISCORD_OWNER_ID,
    invite: config.discord.DISCORD_INVITE,
    disableMentions: 'everyone',
    partials: ['GUILD_MEMBER'],
    ws: { intents: intents },
});


// Initialize client
function init() {
    client.loadEvents('./events');
    client.loadGroups();
    client.loadCommands();
    client.login(client.token);
}

init();


process.on('unhandledRejection', (err) => client.logger.error(err));
