const { Command } = require('discord.js-commando');
const { yandex_key } = require('../../config');
const translate = require('translate');
const Discord = require('discord.js');
const { auto_testing, webhook_token, webhook_id } = require('../../config');
module.exports = class TestCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'test',
			aliases: ['te', 'test', 'tes'],
			group: 'util',
			memberName: 'test',
			guildOnly: true,
			description: 'Translates your text into the desired language!',
			examples: ['!test [language] [text]'],
			throttling: {
				usages: 1,
				duration: 10,
			},

		});
	}
	run(message) {


		// `m` is a message object that will be passed through the filter function
		const filter = m => m.content.includes('~test');
		const collector = message.channel.createMessageCollector(filter, { time: 15000 });

		collector.on('collect', m => {
			message.client.channels.cache.get(auto_testing).send('~ping');
			console.log(`Collected ${m.content}`);
		});

		collector.on('end', collected => {
			console.log(`Collected ${collected.size} items`);
		});
	}

};
