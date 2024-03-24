const Command = require('../../structures/Command');

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
                    key: 'amount',
                    prompt:
                        'How many tokens to add?',
                    type: 'integer',
                    default: 0,
                },
                {
                    key: 'user',
                    prompt: 'Which user would you like to add tokens to?',
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
        const balance = await this.client.dbHelper.addBalance(user.id, amount);
        return msg.say(
            `Added ${balance} tokens to ${user.tag}! Their new balance is ${balance}`
        );
    }
};
