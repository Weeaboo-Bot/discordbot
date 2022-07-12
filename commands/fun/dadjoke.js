const Command = require('../../structures/Command');
const Discord = require('discord.js');


module.exports = class DadJokeCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'dadjoke',
            aliases: ['dadpun', 'joke', 'pun'],
            group: 'fun',
            memberName: 'dadjoke',
            guildOnly: true,
            description: 'Get a random dad joke!',
            examples: ['!dadjoke'],
        });
    }

    async run(message) {
        await this.apiReq
            .get('https://icanhazdadjoke.com/', {
                headers: { Accept: 'application/json' },
            })
            .then(function (res) {
                const msg = new Discord.MessageEmbed()
                    .setAuthor(
                        "Here's a joke!",
                        'https://files.catbox.moe/3cvymb.gif'
                    )
                    .setDescription(res.data.joke)
                    .setColor('#727684');

                return message.channel.send({ embed: msg });
            })
            .catch(function (err) {
                message.client.logger.error(err);
                message.client.botLogger({
                    embed: message.client.errorMessage(
                        err,
                        message.client.errorTypes.API,
                        message.command.name
                    ),
                });
            });
    }
};
