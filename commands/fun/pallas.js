const Command = require('../../structures/Command');
const Discord = require('discord.js');

module.exports = class PallasCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'pallas',
            aliases: ['pallascat'],
            group: 'fun',
            memberName: 'pallas',
            guildOnly: true,
            description: 'Sends a random picture of a pallas cat!',
            examples: ['!pallas'],
            throttling: { usages: 1, duration: 5 },
        });
    }

    async run(message) {
        // do normal Req
        await this.apiReq
            .get(message.client.apiKeys.AZURE_ENDPOINT + 'v7.0/images/search', {
                params: {
                    q: 'pallas cat',
                    imageType: 'photo'
                },
                headers: {
                    'Ocp-Apim-Subscription-Key': message.client.apiKeys.AZURE_KEY_A,                }
            })
            .then(function (res) {
                const pallasCat = res.data.value[Math.floor(Math.random()*res.data.value.length)];
                return message.channel.send({
                    embed: new Discord.MessageEmbed()
                        .setImage(pallasCat.contentUrl)
                        .setTitle('Pallas Cat')
                        .setURL(pallasCat.hostPageDisplayUrl)
                        .setDescription('This is Pallas Cat')
                        .setFooter(
                            `${pallasCat.hostPageDisplayUrl}`,
                            `${pallasCat.thumbnailUrl}`
                        )
                        .setColor('#71A3BE'),
                });
            })
            .catch(function (err) {
                message.client.botLogger
                    ({
                        embed: message.client.errorMessage(
                            err,
                            message.client.errorTypes.API,
                            message.command.name
                        ),
                    });
            });
    }
};
