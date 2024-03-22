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
        await this.apiReq
            .get('http://history.muffinlabs.com/date')
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
                message.client.botLogger({
                    embed: message.client.errorMessage(
                        message.client.logger,
                        err,
                        message.client.errorTypes.API,
                        message.command.name
                    ),
                });
            });
    }
};
