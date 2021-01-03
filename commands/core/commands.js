const Command = require('../../structures/Command');
const fs = require('fs');


module.exports = class CommandsCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'commandslist',
			aliases: ['commandlist', 'cmds', 'cmd'],
			group: 'core',
			memberName: 'commandslist',
			description: 'Sends a list of all commands!',
			details: 'Use the reactions to scroll through the panels!',
			examples: ['!commands'],
			throttling: {
				usages: 1,
				duration: 10,
			},
		});
	}
	async run(message) {
		const commands = this.client.registry.commands.toJSON();


		for(const index in commands) {
			const name = commands[index].name;
			const description = commands[index].description;
			const group = commands[index].groupID;

			const msg = `Command Name: ${name}\nCommand Description: ${description}\nCommand Group: ${group}\n\n`;


			fs.appendFileSync('commandList.txt', msg, function(err) {
				if(err) throw err;
				console.log('Command File Exported.');
			});
		}
	}


};
