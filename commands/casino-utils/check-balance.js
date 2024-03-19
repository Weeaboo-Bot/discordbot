const Command = require('../../structures/Command');
const Discord = require('discord.js');

module.exports = class CheckBalanceCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'check-balance',
            group: 'casino-utils',
            memberName: 'check-balance',
            description: 'Check a user\'s casino balance',
            args: [
                {
                    key: 'user',
                    prompt: 'Which user do you want to check balance for?',
                    type: 'user',
                    default: (msg) => msg.author,
                },
            ],
        });
    }

    async run(msg, { user }) {
        // if (msg.channel.id !== this.client.casinoChannel) { // Replace with the actual channel ID
        //   return; // Do nothing if channel doesn't match
        // }

        try {
            // check if user exists first
            const userExists = await this.client.casino.getUser(user.id);
            if (!userExists) {
                msg.reply(`User ${user.tag} doesn't exist in the database.`);
                return;
            }
            const userBalance = await this.client.casino.checkUserBalance(user.id);
            msg.say(`User ${user.tag} has balance of ${userBalance}`);
        } catch (error) {
            msg.client.botLogger({
                embed: msg.client.errorMessage(
                    error,
                    msg.client.errorTypes.FIREBASE,
                    msg.command.name
                ),
            });
        }

    }

};
