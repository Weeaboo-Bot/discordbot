const Command = require('../../structures/Command');
const Discord = require('discord.js');

module.exports = class NekoCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'neko',
            aliases: ['catgirl', 'nekomimi', 'nekos'],
            group: 'nsfw',
            memberName: 'neko',
            guildOnly: false,
            description: 'Nekos!',
            details:
                'This command is NSFW in NSFW channels and not NSFW in normal channels!',
            examples: ['~neko'],
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
                    message.client.channel.cache
                        .get(message.client.errorLog)
                        .send({
                            embed: message.client.errorMessage(
                                err,
                                message.client.errorTypes.API,
                                message.command.name
                            ),
                        });
                });
        } else {
            await this.apiReq
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
                    message.client.channel.cache
                        .get(message.client.errorLog)
                        .send({
                            embed: message.client.errorMessage(
                                err,
                                message.client.errorTypes.API,
                                message.command.name
                            ),
                        });
                });
        }
    }
};
