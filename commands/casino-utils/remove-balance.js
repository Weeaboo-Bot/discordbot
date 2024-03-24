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
        const balance = await this.client.dbHelper.removeBalance(user.id, amount);
        return msg.say(
            `Removed ${amount} tokens from ${user.tag}! Their new balance is ${balance}`
        );
    }
};
