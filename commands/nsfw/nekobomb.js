const Command = require('../../structures/Command');
const Discord = require('discord.js');

module.exports = class NekoBombCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'nekobomb',
            memberName: 'nekobomb',
            description: 'Send 5 !neko to chat',
            group: 'nsfw',
        });
    }
    async run(message) {
        if (!message.channel.nsfw) {
            await this.apiReq
                .get('http://nekos.life/api/neko')
                .then(function (res) {
                    return message.channel.send({
                        embed: new Discord.MessageEmbed()
                            .setImage(res.data.neko)
                            .setColor('#A187E0')
                            .setFooter(
                                'http://nekos.life',
                                'https://a.safe.moe/3XYZ6.gif'
                            ),
                    });
                })
                .catch(function (err) {
                    message.client.botLogger
                        .send({
                            embed: errorMessage(
                                err,
                                message.client.errorTypes.API,
                                message.command.name
                            ),
                        });
                });
        } else {
            let counter = 0;
            while (counter < 5) {
                await axios
                    .get('http://nekos.life/api/lewd/neko')
                    .then(function (res) {
                        return message.channel.send({
                            embed: new Discord.MessageEmbed()
                                .setImage(res.data.neko)
                                .setColor('#A187E0')
                                .setFooter(
                                    'http://nekos.life',
                                    'https://a.safe.moe/3XYZ6.gif'
                                ),
                        });
                    })
                    .catch(function (err) {
                        message.client.botLogger.send({
                            embed: errorMessage(
                                err,
                                message.client.errorTypes.API,
                                message.command.name
                            ),
                        });
                    });
                counter++;
            }
        }
    }
};
