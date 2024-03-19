const config = require('./config');
const express = require('express');
const Discord = require('discord.js');
const Client = require('./structures/Client');
const Sentry = require("@sentry/node");
const { nodeProfilingIntegration } = require("@sentry/profiling-node");
const { getFormattedTime } = require('./util/Util');
const cron = require('node-cron');

const DAILY_BALANCE_CHECK = '0 0 * * *';

global.__basedir = __dirname;

Sentry.init({
  dsn: config.sentry.SENTRY_DSN,
  integrations: [
    nodeProfilingIntegration(),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  // Set sampling rate for profiling - this is relative to tracesSampleRate
  profilesSampleRate: 1.0,
});

// Client setup
const app = express();
const port = process.env.PORT || 3000;
const client = new Client(config, {
  intents: new Discord.Intents().add('GUILD_PRESENCES',
    'GUILD_MEMBERS',
    'GUILDS',
    'GUILD_VOICE_STATES',
    'GUILD_MESSAGES',
    'GUILD_MESSAGE_REACTIONS'),
  commandPrefix: '$',
  owner: config.discord.DISCORD_OWNER_ID,
  invite: config.discord.DISCORD_INVITE,
  disableMentions: 'everyone',
  partials: ['GUILD_MEMBER'],
  ws: {
    intents: new Discord.Intents().add('GUILD_PRESENCES',
      'GUILD_MEMBERS',
      'GUILDS',
      'GUILD_VOICE_STATES',
      'GUILD_MESSAGES',
      'GUILD_MESSAGE_REACTIONS')
  },
});


// Initialize client
function init() {
  client.loadEvents('./events');
  client.loadGroups();
  client.loadCommands();
  client.login(client.token);
  // Load FireBase app
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    process_uptime: Math.round(process.uptime()),
    client_update: Math.round(client.uptime),
    guilds: client.guilds.cache.size,
    commands: client.registry.commands.size,
    groups: client.registry.groups.size,
    latency: Math.round(client.ws.ping),
    status: client.ws.status,
    ownerId: client.ownerId,
    readyAt: client.readyAt,
    message: `Bot Ok and Running at ${getFormattedTime()}`,
  });
});

app.listen(port, () => {
  console.log(`Health check server listening on port ${port}`);
});


init();

const job = cron.schedule(DAILY_BALANCE_CHECK, client.casino.checkDailyUserBalance, {
  scheduled: true,
  timezone: 'UTC'
});
job.start();

process.on('unhandledRejection', (err) => client.logger.error(err));
