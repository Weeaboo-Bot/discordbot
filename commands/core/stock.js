const Command = require('../../structures/Command');
const Discord = require('discord.js');
const { errorMessage } = require('../../util/logHandler');
const ErrorEnum = require('../../util/errorTypes.json');
const alphakey = require('../../config').api.ALPHA_KEY;
const alpha = require('alphavantage')({ key: alphakey });

module.exports = class StockCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'stock',
            aliases: ['stonk'],
            group: 'core',
            memberName: 'stock',
            guildOnly: true,
            description: 'stock prices!',
            examples: ['!stock <symbol>'],
            throttling: {
                usages: 1,
                duration: 3,
            },
            args: [
                {
                    key: 'stock',
                    label: 'which stock to lookup',
                    prompt: 'Please provide me a stock to lookup!',
                    type: 'string',
                },
            ],
        });
    }

    run(message, { stock }) {
        try {
            alpha.data
                .intraday(stock, 'compact', 'json', '5min')
                .then((data) => {
                    if (data != null) {
                        const result = this.toArray(data['Time Series (5min)']);
                        const embed = new Discord.MessageEmbed()
                            .setTitle(data['Meta Data']['1. Information'])
                            .setColor('#FBCFCF')
                            .addField(
                                'Stock Symbol: ',
                                data['Meta Data']['2. Symbol']
                            )
                            .addField(
                                'Last Updated: ',
                                data['Meta Data']['3. Last Refreshed']
                            )
                            .addField('Stock Open: ', result[0][0])
                            .addField('Stock High: ', result[0][1])
                            .addField('Stock Low: ', result[0][2])
                            .addField('Stock Close: ', result[0][3])
                            .addField('Stock Volume: ', result[0][4]);

                        message.delete();
                        return message.channel.send({ embed: embed });
                    } else {
                        return message.channel.send(
                            'Sorry, could not process request.'
                        );
                    }
                });
        } catch (error) {
            message.client.channels.cache.get(message.client.errorLog).send({
                embed: errorMessage(error, ErrorEnum.API, message.command.name),
            });
        }
    }
    toArray(obj) {
        const result = [];
        for (const prop in obj) {
            const value = obj[prop];
            if (typeof value === 'object') {
                result.push(this.toArray(value));
            } else {
                result.push(value);
            }
        }
        return result;
    }
};
