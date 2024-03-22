const Command = require('../../structures/Command');
const moment = require('moment');
const { MessageEmbed } = require('discord.js');

module.exports = class RemoveBalance extends Command {
    constructor(client) {
        super(client, {
            name: 'remove-balance',
            aliases: ['remove-tokens'],
            group: 'casino-utils',
            memberName: 'remove-balance',
            description: 'Remove token balance from a user',
            args: [
                {
                    key: 'amount',
                    prompt:
                        'How many tokens to remove?',
                    type: 'integer',
                    default: 0,
                },
                {
                    key: 'user',
                    prompt: 'Which user would you like to remove tokens from?',
                    type: 'user',
                    default: (msg) => msg.author,
                },
            ],
        });
    }

    async run(msg, { user, amount }) {
        const balance = await this.client.dbHelper.removeBalance(user.id, amount);
        return msg.say(
            `Removed ${amount} tokens from ${user.tag}! Their new balance is ${balance}`
        );
    }
};
