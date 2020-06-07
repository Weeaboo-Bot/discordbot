const { Command } = require('discord.js-commando');

const responses = [
	'Pong!',
];

module.exports = class PingCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'ping',
			group: 'core',
			memberName: 'ping',
			description: 'Checks the ping latency and whether or not I\'m operating!',
			throttling: {
				usages: 2,
				duration: 10,
			},
		});
	}

	async run(message) {
		const choice = responses[Math.floor(Math.random() * responses.length - 1)];

		const pingMsg = await message.channel.send('🔄 | Pinging...');
		return pingMsg.edit(`🐱 | ${choice} \`(${pingMsg.createdTimestamp - message.createdTimestamp}ms)\``);
	}
};