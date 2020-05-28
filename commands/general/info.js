const { Command } = require('discord.js-commando');

module.exports = class InfoCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'info',

			group: 'general',
			memberName: 'info',
			description: 'General Server Info',
			throttling: {
				usages: 2,
				duration: 10,
			},
		});
	}

	run(msg) {
        
        
		return msg.say(`Server Name: ${msg.guild.name}\nTotal Members: ${msg.guild.memberCount}`);
	}
}

