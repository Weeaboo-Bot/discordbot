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
                    embed: message.client.errorMessage(
                        err,
                        message.client.errorTypes.API,
                        message.command.name
                    ),
                });
            });
    }
};
