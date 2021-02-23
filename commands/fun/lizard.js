const Command = require('../../structures/Command');
const Discord = require('discord.js');
const axios = require('axios');
const LogHandler = require('../../util/logHandler');
const ErrorEnum = require('../../assets/json/errorTypes.json');

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
        const LOG = new LogHandler();
        await axios
            .get('https://nekos.life/api/lizard')
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
                    embed: LOG.errorMessage(
                        err,
                        ErrorEnum.API,
                        message.command.name
                    ),
                });
            });
    }
};
