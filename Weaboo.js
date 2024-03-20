const config = require('./config');
const express = require('express');
const Discord = require('discord.js');
const Client = require('./structures/Client');
const Sentry = require("@sentry/node");
const { nodeProfilingIntegration } = require("@sentry/profiling-node");

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
const intents = new Discord.Intents();
intents.add(
  'GUILD_PRESENCES',
  'GUILD_MEMBERS',
  'GUILDS',
  'GUILD_VOICE_STATES',
  'GUILD_MESSAGES',
  'GUILD_MESSAGE_REACTIONS',
);

const app = express();
const port = process.env.PORT || 3000;

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
    message: `Bot Ok and Running at ${() => {
      const now = new Date();
      const pad = (num) => num.toString().padStart(2, '0'); // Helper function for padding

      const hours = pad(now.getHours());
      const minutes = pad(now.getMinutes());
      const seconds = pad(now.getSeconds());

      const day = pad(now.getDate());
      const month = pad(now.getMonth() + 1); // Months are 0-indexed
      const year = now.getFullYear();

      return `${hours}:${minutes}:${seconds} ${month}/${day}/${year}`;
    }}`,
  });
});

app.listen(port, () => {
  console.log(`Health check server listening on port ${port}`);
});


process.on('unhandledRejection', (err) => client.logger.error(err));
