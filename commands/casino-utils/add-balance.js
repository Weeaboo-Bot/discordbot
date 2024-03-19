const Command = require('../../structures/Command');
const Discord = require('discord.js');

module.exports = class AddBalanceCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'add-balance',
            group: 'casino-utils',
            memberName: 'add-balance',
            description: 'Add to a user\'s casino balance',
            args: [
                {
                    key: 'user',
                    prompt: 'Which user do you want to add balance for?',
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
            msg.reply(`User ${user.tag} has balance of ${await this.client.casino.checkUserBalance(user.id)}, how much would you like to add?`);
            // Define a filter function to check for messages from the same author
            const filter = (m) => m.author.id === msg.author.id;

            try {
                // Wait for a message from the same author (within a timeout)
                const collectedMessages = await msg.channel.awaitMessages(filter, { max: 1, time: 15000 }); // Timeout of 15 seconds
                const responseMessage = collectedMessages.first();

                // Process the user's response message (e.g., handle their request)
                const amount = parseInt(responseMessage.content);
                if (isNaN(amount)) {
                    msg.say('Please enter a valid number.');
                    return;
                } else {
                    msg.say(`User ${user.tag} has been given ${amount} tokens.`);
                    return msg.reply(`The new user balance is ${await this.client.casino.addBalance(user.id, amount)}`);
                }
            } catch (error) {
                this.logger.error(`Error waiting for message: ${error}`);
                // Handle cases like timeout or other errors
            }
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
