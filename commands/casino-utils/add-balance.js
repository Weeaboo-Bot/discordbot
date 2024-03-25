const Command = require('../../structures/Command');

module.exports = class AddBalanceCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'add-balance',
            aliases: ['add-tokens', 'addbal'],
            group: 'casino-utils',
            ownerOnly: true,
            memberName: 'add-balance',
            description: 'Add token balance to a user, use like (amount)(user)',
            args: [
                {
                    key: 'amount',
                    prompt:
                        'How many tokens to add?',
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
        try {
            const balance = await this.client.dbHelper.addBalance(user.id, amount);
            if (balance) {
                return msg.say(
                    `Added ${amount} tokens to ${user.tag}! Their new balance is ${balance}`
                );
            } else {
                return msg.say(`Something went wrong`);
            }
        } catch (error) {
            msg.reply('Sorry, an error happened trying to add tokens.')
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
