const Command = require('../../structures/Command');

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

    async run(msg, { user }) {
        const isPlayer = await this.client.dbHelper.isPlayer(user.id);
        if (!isPlayer) {
            return msg.say('You need to register your account before playing!');
        }
        const balance = await this.client.dbHelper.getBalance(user.id);
        return msg.say(
            `Balance of ${user.tag}: ${balance} tokens`
        );
    }
};
