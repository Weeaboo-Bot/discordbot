const Command = require('../../structures/Command');
const Discord = require('discord.js');
const { GiphyFetch } = require('@giphy/js-fetch-api');

module.exports = class GiphyCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'giphy',
            group: 'fun',
            aliases: ['gif'],
            memberName: 'giphy',
            description: 'Searches Giphy for gifs!',
            examples: ['!giphy [tags]'],
            args: [
                {
                    key: 'query',
                    prompt: 'Please provide me a term to search for!',
                    type: 'string',
                    default: 'wtf',
                },
            ],
        });
    }

    async run(message, { query }) {
        const gf = new GiphyFetch(message.client.apiKeys.GIPHY_KEY);

        await gf
            .search(query, {
                sort: 'relevant',
                lang: 'en',
                limit: 10,
                type: 'gifs',
            })
            .then(function (res) {
                if (!res.data.length) {
                    return message.channel.send(
                        `No results found for **${query}**!`
                    );
                }
                const random = Math.floor(Math.random() * res.data.length);

                return message.channel.send({
                    embed: new Discord.MessageEmbed()
                        .setImage(res.data[random].images.original.url)
                        .setColor('#ADC4CC'),
                });
            })
            .catch(function (err) {
                message.client.botLogger
                    ({
                        embed: message.client.errorMessage(
                            message.client.logger,
                            err,
                            message.client.errorTypes.API,
                            message.command.name
                        ),
                    });
            });
    }
};
