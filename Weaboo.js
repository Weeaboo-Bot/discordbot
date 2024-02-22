const config = require('./config');
const Discord = require('discord.js');
const Client = require('./structures/Client');

global.__basedir = __dirname;

// You can also use ESM `import * as Sentry from "@sentry/node"` instead of `require`
const Sentry = require("@sentry/node");
import { ProfilingIntegration } from "@sentry/profiling-node";

Sentry.init({
  dsn: "https://fcf71f3bff39a9628f404f08c83e1741@o4506793068527616.ingest.sentry.io/4506793068724224",
  integrations: [
    new ProfilingIntegration(),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  // Set sampling rate for profiling - this is relative to tracesSampleRate
  profilesSampleRate: 1.0,
});

// Client setup
const intents = new Discord.Intents();
intents.add(
    'GUILD_PRESENCES',
    'GUILD_MEMBERS',
    'GUILDS',
    'GUILD_VOICE_STATES',
    'GUILD_MESSAGES',
    'GUILD_MESSAGE_REACTIONS'
);

const client = new Client(config, {
    commandPrefix: config.discord.DISCORD_PREFIX,
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
