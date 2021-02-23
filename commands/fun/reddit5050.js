const Command = require('../../structures/Command');
const Discord = require('discord.js');
const LogHandler = require('../../util/logHandler');
const ErrorEnum = require('../../assets/json/errorTypes.json');
const axios = require('axios');

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

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
        const LOG = new LogHandler();
        await axios
            .get('https://www.reddit.com/r/FiftyFifty.json')
            .then(function (res) {
                const index = getRndInteger(0, res.data.data.children.length);
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
                    embed: LOG.errorMessage(
                        err,
                        ErrorEnum.API,
                        message.command.name
                    ),
                });
            });
    }
};
