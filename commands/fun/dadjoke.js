const Command = require('../../structures/Command');
const Discord = require('discord.js');

module.exports = class DadJokeCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'dadjoke',
            aliases: ['dadpun', 'joke', 'pun'],
            group: 'fun',
            memberName: 'dadjoke',
            guildOnly: true,
            description: 'Get a random dad joke!',
            examples: ['!dadjoke'],
        });
    }

    async run(message) {
        message.command.reqURL = 'https://icanhazdadjoke.com/';
        await message.command.axiosConfig
            .get(message.command.reqURL, {
                headers: { Accept: 'application/json' },
            })
            .then(function (res) {
                const msg = new Discord.MessageEmbed()
                    .setAuthor(
                        "Here's a joke!",
                        'https://files.catbox.moe/3cvymb.gif'
                    )
                    .setDescription(res.data.joke)
                    .setColor('#727684');
                return message.channel.send({ embed: msg });
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
