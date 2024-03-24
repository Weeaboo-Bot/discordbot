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
                    validate: (amount) => {
                        if (!amount.length) {
                            return 'Please provide a number to validate, please try again.';
                        }
                      
                          const number = parseInt(amount);
                      
                          // Check if conversion to integer resulted in NaN (Not a Number)
                          if (isNaN(amount) || amount < 0) {
                            return 'The provided value is not a valid number, please try again.';
                          }
                      
                          // Check if the converted number is equal to the original string after conversion (removes decimals)
                          if (number.toString() !== amount) {
                            return 'The provided value is not an integer (contains decimals), please try again.';
                          }
                        return true;
                    }
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
        try {
            const balance = await this.client.dbHelper.setBalance(user.id, amount);
            return msg.say(
                `Set ${amount} tokens to ${user.tag}! Their new balance is ${balance}`
            );
        } catch (error) {
            msg.reply('Sorry, an error happened trying to set tokens.')
            msg.client.botLogger({
                embed: msg.client.errorMessage(
                    msg.client.logger,
                    error,
                    msg.client.errorTypes.DATABASE,
                    msg.command.name
                ),
            });
        }
    }
};
