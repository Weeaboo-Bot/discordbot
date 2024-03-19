const Command = require('../../structures/Command');
const moment = require('moment');
const { MessageEmbed } = require('discord.js');

module.exports = class CheckBalanceCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'check-balance',
            aliases: ['check-tokens'],
            group: 'casino-utils',
            memberName: 'check-balance',
            description: 'Check a user\'s token balance',
            args: [
                {
                    key: 'user',
                    prompt: 'Which user would you like to get tokens of?',
                    type: 'user',
                    default: (msg) => msg.author,
                },
            ],
        });
    }

    run(msg, { user }) {
        const balance = this.client.dbHelper.getBalance(user.id);
        return msg.say(
            `Balance of ${user.tag}: ${balance} tokens`
        );
    }
};
