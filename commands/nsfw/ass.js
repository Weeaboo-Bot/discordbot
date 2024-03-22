const Command = require('../../structures/Command');
const Discord = require('discord.js');
const errors = require('../../assets/json/errors');

module.exports = class AssCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'ass',
            aliases: ['butt', 'booty', 'butts'],
            group: 'nsfw',
            memberName: 'ass',
            guildOnly: true,
            description: 'A random picture of...ASS!!',
            examples: ['!ass'],
            details: 'This command can only be used in NSFW channels!',
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
                .get(`http://api.obutts.ru/butts/${id}`)
                .then(function (res) {
                    const y = id;
                    return message.channel.send({
                        embed: new Discord.MessageEmbed()
                            .setFooter('http://obutts.ru/')
                            .setImage(
                                `http://media.obutts.ru/${res.data[0].preview}`
                            )
                            .setColor('#CEA0A6'),
                    });
                })
                .catch(function (err) {
                    message.client.botLogger
                        .send({
                            embed: message.client.errorMessage(
                                message.client.logger,
                                err,
                                message.client.errorTypes.API,
                                message.command.name
                            ),
                        });
                });
        }
    }
};
