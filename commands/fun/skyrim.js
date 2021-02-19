const Command = require('../../structures/Command');
const Discord = require('discord.js');
const line = require('../../assets/json/skyrim.json');

module.exports = class SkyrimCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'skyrim',
            aliases: ['guard', 'skyrimguard', 'guardline'],
            group: 'fun',
            memberName: 'skyrim',
            guildOnly: true,
            description: 'Get a random guard quote from skyrim!',
            examples: ['~skyrim'],
            throttling: {
                usages: 1,
                duration: 3,
            },
        });
    }

    run(message) {
        return message.channel.send(
            line[Math.round(Math.random() * (line.length - 1))]
        );
    }
};
