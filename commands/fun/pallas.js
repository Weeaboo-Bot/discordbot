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
                return message.channel.send({
                    embed: new Discord.MessageEmbed()
                        .setImage(res.value[0].contentUrl)
                        .setTitle('Pallas Cat')
                        .setDescription(`[Image URL](${res.data.url})`)
                        .setFooter(
                            `${res.value[0].hostPageDisplayUrl}`,
                            `${res.value[0].thumbnailUrl}`
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
