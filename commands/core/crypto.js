const Command = require('../../structures/Command');
const Discord = require('discord.js');
const alphakey = require('../../config').api.ALPHA_KEY;
const alpha = require('alphavantage')({ key: alphakey });

module.exports = class CryptoCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'crypto',
            aliases: ['btc'],
            group: 'core',
            memberName: 'crypto',
            guildOnly: true,
            description: 'crypto prices!',
            examples: ['!crypto <symbol>'],
            args: [
                {
                    key: 'crypto',
                    label: 'which crypto to lookup',
                    prompt: 'Please provide me a crypto to lookup!',
                    type: 'string',
                },
            ],
        });
    }

    run(message, { crypto }) {
        const currDate = new Date().toISOString().split('T')[0];
        try {
            alpha.crypto.daily(crypto, 'USD').then((data) => {
                if (data != null) {
                    const embed = new Discord.MessageEmbed()
                        .setTitle(data['Meta Data']['1. Information'])
                        .setColor('#FBCFCF')
                        .addField(
                            'Stock Symbol: ',
                            data['Meta Data']['2. Digital Currency Code']
                        )
                        .addField(
                            'Last Updated: ',
                            data['Meta Data']['6. Last Refreshed']
                        )

                        .addField(
                            'Stock Open: ',
                            data['Time Series (Digital Currency Daily)'][
                                currDate
                            ]['1a. open (USD)']
                        )
                        .addField(
                            'Stock High: ',
                            data['Time Series (Digital Currency Daily)'][
                                currDate
                            ]['2a. high (USD)']
                        )
                        .addField(
                            'Stock Low: ',
                            data['Time Series (Digital Currency Daily)'][
                                currDate
                            ]['3a. low (USD)']
                        )
                        .addField(
                            'Stock Close: ',
                            data['Time Series (Digital Currency Daily)'][
                                currDate
                            ]['4a. close (USD)']
                        )
                        .addField(
                            'Stock Volume: ',
                            data['Time Series (Digital Currency Daily)'][
                                currDate
                            ]['5. volume']
                        )
                        .addField(
                            'Stock Market Cap: ',
                            data['Time Series (Digital Currency Daily)'][
                                currDate
                            ]['6. market cap (USD)']
                        );

                    message.delete();
                    return message.channel.send({ embed: embed });
                } else {
                    return message.channel.send(
                        'Sorry, could not process request.'
                    );
                }
            });
        } catch (error) {
            message.client.botLogger({
                embed: message.client.errorMessage(message.client.logger, error, message.client.errorTypes.API, message.command.name),
            });
        }
    }
};
