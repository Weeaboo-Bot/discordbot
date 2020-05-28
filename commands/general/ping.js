const { Command } = require('discord.js-commando');

module.exports = class PingCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'ping',
           
            group: 'general',
            memberName: 'ping',
            description: 'Ping Test',
            throttling: {
                usages: 2,
                duration: 10,
            },
        });
    }

    run(message) {
        return message.say('Pong!!!')
    }
}

