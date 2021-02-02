const config = require('./config');
const { Intents } = require('discord.js');
const Client = require('./structures/Client');
const Sentry = require('@sentry/node');
const Tracing = require('@sentry/tracing');


global.__basedir = __dirname;


Sentry.init({
	dsn: 'https://c7c6cdcfb19041ddb0a0946b360ddb97@o499509.ingest.sentry.io/5578077',

	// We recommend adjusting this value in production, or using tracesSampler
	// for finer control
	tracesSampleRate: 1.0,
});


// Client setup
const intents = new Intents();
intents.add(
	'GUILD_PRESENCES',
	'GUILD_MEMBERS',
	'GUILDS',
	'GUILD_VOICE_STATES',
	'GUILD_MESSAGES',
	'GUILD_MESSAGE_REACTIONS',
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
	const transaction = Sentry.startTransaction({
		op: 'test',
		name: 'My First Test Transaction',
	});

	setTimeout(() => {
		try {
			foo();
		}
		catch (e) {
			Sentry.captureException(e);
		}
		finally {
			transaction.finish();
		}
	}, 99);

}

function foo() {
	console.log('foo');
}

init();

process.on('unhandledRejection', err => client.logger.error(err));
