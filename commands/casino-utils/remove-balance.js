const Command = require('../../structures/Command');


module.exports = class RemoveBalance extends Command {
    constructor(client) {
        super(client, {
            name: 'remove-balance',
            aliases: ['remove-tokens', 'delbalanace'],
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
        if (await this.client.casinoUtils.playerNeedsRegister(msg, user.id)) {
            return msg.reply(`You need to register your account before playing!, run ${msg.client.prefix}create-player`);
        }
        const balance = await this.client.dbHelper.removeBalance(user.id, amount);
        return msg.say(
            `Removed ${amount} tokens from ${user.tag}! Their new balance is ${balance}`
        );
    }
};
