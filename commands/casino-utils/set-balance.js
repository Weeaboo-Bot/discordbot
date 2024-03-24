const Command = require('../../structures/Command');


module.exports = class SetBalanceCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'set-balance',
            aliases: ['setbal'],
            group: 'casino-utils',
            memberName: 'set-balance',
            ownerOnly: true,
            description: 'Set token balance for a user',
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
        const balance = await this.client.dbHelper.setBalance(user.id, amount);
        return msg.say(
            `Set ${amount} tokens to ${user.tag}! Their new balance is ${balance}`
        );
    }
};
