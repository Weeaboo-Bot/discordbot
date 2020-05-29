const { Command } = require('discord.js-commando')


module.exports = class HelloCommand extends Command{
    constructor(client) {
        super(client, {
            name: 'hello',
            description: 'Return Hello World',
            memberName: 'hello',
            aliases: ['helloworld'],
            group: 'general'
        });
    }
    run(message, args, fromPattern, result) {
        message.say("Hello World");
    }

}