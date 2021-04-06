const Command = require('../../structures/Command');
const Discord = require('discord.js');
const errors = require('../../assets/json/errors');

module.exports = class BoobsCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'boobs',
            aliases: ['boobies', 'bobs'],
            group: 'nsfw',
            memberName: 'boobs',
            guildOnly: true,
            description: 'Show a picture of boobs!',
            details: 'This command can only be used in NSFW channels!',
            examples: ['!boobs'],
        });
    }

    async run(message) {
        const errMessage =
            errors[Math.round(Math.random() * (errors.length - 1))];
        if (!message.channel.nsfw) {
            await message.react('💢');
            return message.channel.send(errMessage);
        } else {
            const id = [Math.floor(Math.random() * 4923)];
            await this.apiReq
                .get('http://api.oboobs.ru/boobs/', {
                    params: {
                        id: id,
                    },
                })
                .then(function (res) {
                    return message.channel.send({
                        embed: new Discord.MessageEmbed()
                            .setFooter('http://oboobs.ru/')
                            .setImage(
                                `http://media.oboobs.ru/${res.data[0].preview}`
                            )
                            .setColor('#CEA0A6'),
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
