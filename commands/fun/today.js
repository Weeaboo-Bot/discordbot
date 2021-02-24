const Command = require('../../structures/Command');
const Discord = require('discord.js');

module.exports = class TodayCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'today',
            guildOnly: true,
            aliases: ['date', 'history'],
            group: 'fun',
            memberName: 'today',
            description: 'Finds a historical event from today!',
            examples: ['!today'],
        });
    }

    async run(message) {
        message.command.reqURL = 'http://history.muffinlabs.com/date';
        await message.command.axiosConfig
            .get(message.command.reqURL)
            .then(function (res) {
                const source = res.data.data['Events'];
                const event =
                    source[Math.round(Math.random() * (source.length - 1))];
                return message.channel.send({
                    embed: new Discord.MessageEmbed()
                        .setAuthor(
                            `Historical Event from ${res.data.date}, ${event.year}`
                        )
                        .setColor('#B1AFFC')
                        .setDescription(event.text)
                        .addField(
                            '❯\u2000Information',
                            `•\u2000\**Year:** ${
                                event.year
                            }\n\•\u2000\**External Link${
                                event.links.length !== 1 ? 's' : ''
                            }:** ${event.links
                                .map((l) => `[${l.title}](${l.link})`)
                                .join(', ')}`
                        ),
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
