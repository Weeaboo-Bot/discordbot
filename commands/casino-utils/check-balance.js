const Command = require('../../structures/Command');

module.exports = class CheckBalanceCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'check-balance',
            aliases: ['check-tokens', 'balance'],
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

    async run(msg, { user }) {
        if (await this.client.casinoUtils.playerNeedsRegister(msg, user.id)) {
            return msg.reply(`You need to register your account before playing!, run ${msg.client.prefix}create-player`);
        }
        const balance = await msg.client.dbHelper.getBalance(user.id);
        return msg.say(
            `Balance of ${user.tag}: ${balance} tokens`
        );
    }
};
