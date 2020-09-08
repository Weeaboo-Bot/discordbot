const Discord = require('discord.js');
const Command = require('../../models/Command');
const { webhook_id, webhook_token } = require('../../config');

module.exports = class WebhookCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'hook',
			memberName: 'hook',
			aliases: ['webhook', 'whook'],
			group: 'owner',
			description: 'Webhook command',
		});
	}

	async run(message) {

		
		const hook = new Discord.WebhookClient(webhook_id, webhook_token);

        
        const filter = m => m.content.includes('~hook');

        const collector = message.channel.createMessageCollector(filter, { time: 10000});
        collector.on('collect', m => {
            hook.send('~ping');
            console.log(m);
        });
	}
};