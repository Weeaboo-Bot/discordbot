const Command = require('../../structures/Command');
const Discord = require('discord.js');

module.exports = class AdviceCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'advice',
            group: 'fun',
            memberName: 'advice',
            guildOnly: true,
            description: 'Get some advice!',
            examples: ['!advice'],
        });
    }

    async run(message) {
        const reqURL = 'http://api.adviceslip.com/advice';
        await message.command.axiosConfig
            .get(reqURL)
            .then(function (res) {
                try {
                    const embed = new Discord.MessageEmbed()
                        .setAuthor(
                            "Here's some advice!",
                            'https://files.catbox.moe/3cvymb.gif'
                        )
                        .setDescription(res.data.slip.advice)
                        .setColor('#727684');
                    return message.channel.send({ embed });
                } catch (err) {
                    message.client.channels.cache
                        .get(message.client.errorLog)
                        .send({
                            embed: message.command.discordLogger.errorMessage(
                                err,
                                message.command.errorTypes.JS,
                                message.command.name,
                                reqURL
                            ),
                        });
                }
            })
            .catch(function (err) {
                message.client.channels.cache
                    .get(message.client.errorLog)
                    .send({
                        embed: message.command.discordLogger.errorMessage(
                            err,
                            message.command.errorTypes.API,
                            message.command.name,
                            reqURL
                        ),
                    });
            });
    }
};
