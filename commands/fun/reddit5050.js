const Command = require('../../structures/Command');
const Discord = require('discord.js');
const { randomRange } = require('../../util/Util');

module.exports = class Reddit5050Command extends Command {
    constructor(client) {
        super(client, {
            name: 'reddit5050',
            description: 'Search the Reddit 50/50 Sub',
            memberName: 'reddit5050',
            aliases: ['reddit505game'],
            group: 'fun',
        });
    }
    async run(message) {
        message.command.reqURL = 'https://www.reddit.com/r/FiftyFifty.json';
        await message.command.axiosConfig
            .get(message.command.reqURL)
            .then(function (res) {
                const index = randomRange(0, res.data.data.children.length);
                return message.channel.send({
                    embed: new Discord.MessageEmbed()
                        .setTitle(res.data.data.children[index].data.title)
                        .setURL(
                            'https://www.reddit.com' +
                                res.data.data.children[index].data.permalink
                        )
                        .setImage(res.data.data.children[index].data.url),
                });
            })
            .catch(function (err) {
                message.client.channel.cache.get(message.client.errorLog).send({
                    embed: message.command.discordLogger.errorMessage(
                        err,
                        message.command.errorTypes.API,
                        message.command.name,
                        message.command.reqURL
                    ),
                });
            });
    }
};
