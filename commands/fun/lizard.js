const Command = require('../../structures/Command');
const Discord = require('discord.js');

module.exports = class LizardCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'lizard',
            aliases: ['liz'],
            group: 'fun',
            memberName: 'lizard',
            guildOnly: true,
            description: 'Sends a random picture of a lizard!',
            examples: ['!lizard'],
        });
    }

    async run(message) {
        message.command.reqURL = 'https://nekos.life/api/lizard';
        await message.command.axiosConfig
            .get(message.command.reqURL)
            .then(function (res) {
                return message.channel.send({
                    embed: new Discord.MessageEmbed()
                        .setImage(res.data.url)
                        .setDescription(`[Image URL](${res.data.url})`)
                        .setFooter(
                            'https://nekos.life/ ©',
                            'https://nekos.life/static/lizard/010C.jpg'
                        )
                        .setColor('#71A3BE'),
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
