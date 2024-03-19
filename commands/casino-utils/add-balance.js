const Command = require('../../structures/Command');
const moment = require('moment');
const { MessageEmbed } = require('discord.js');

module.exports = class AddBalanceCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'add-balance',
            aliases: ['add-tokens'],
            group: 'casino-utils',
            memberName: 'add-balance',
            description: 'Add token balance to a user',
            args: [
                {
                    key: 'user',
                    prompt: 'Which user would you like to add tokens to?',
                    type: 'user',
                    default: (msg) => msg.author,
                },
                {
                    key: 'amount',
                    prompt:
                        'How many tokens to add?',
                    type: 'integer',
                    default: 0,
                },
            ],
        });
    }

    run(msg, { user, amount }) {
        const balance = this.client.dbHelper.addBalance(user.id, amount);
        return msg.say(
            `Added ${balance} tokens to ${user.tag}! Their new balance is ${balance}`
        );
    }
};
