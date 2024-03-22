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
        await this.apiReq
            .get('http://api.adviceslip.com/advice')
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
                    message.client.botLogger
                        ({
                            embed: message.client.errorMessage(
                                message.client.logger,
                                err,
                                message.client.errorTypes.JS,
                                message.command.name
                            ),
                        });
                }
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
