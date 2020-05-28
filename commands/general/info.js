const { Command } = require('discord.js-commando');

module.exports = class InfoCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'info',
           
            group: 'general',
            memberName: 'info',
            description: 'Ping Test',
            throttling: {
                usages: 2,
                duration: 10,
            },
        });
    }

    run(msg) {
		msg.guild
        return msg
    }
}

