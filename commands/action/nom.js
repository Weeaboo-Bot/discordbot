const Command = require('../../structures/Command');
const Discord = require('discord.js');
const { disgustP } = require('../../assets/json/actions.json');

module.exports = class NomCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'nom',
            aliases: ['eat', 'munch'],
            group: 'action',
            memberName: 'nom',
            guildOnly: true,
            description: 'Noms on the user you mentioned!',
            examples: ['!nom <user>'],
        });
    }

    async run(message, args) {
        const reqURL = 'https://rra.ram.moe/i/r?type=nom';
        const disgust =
            disgustP[Math.round(Math.random() * (disgustP.length - 1))];
        const recipient = message.content.split(/\s+/g).slice(1).join(' ');

        if (args.length < 1) {
            const embed = new Discord.MessageEmbed()
                .setColor('#FBCFCF')
                .setImage(disgust);
            return message.channel.send(
                `${message.author} noms on... themselves..?`,
                { embed: embed }
            );
        } else if (message.mentions.users.first() == message.author) {
            const embed2 = new Discord.MessageEmbed()
                .setColor('#FBCFCF')
                .setImage(disgust);
            return message.channel.send(
                `${message.author} noms on... themselves..?`,
                { embed: embed2 }
            );
        } else if (message.mentions.users.first() == this.client.user) {
            await message.command.axiosConfig
                .get(reqURL)
                .then(function (response) {
                    // handle success
                    const embed3 = new Discord.MessageEmbed()
                        .setColor('#FBCFCF')
                        .setImage(`https://rra.ram.moe${response.data.path}`);
                    return message.channel.send(
                        'Nyaa~ s-senpai... (´Å`∗)... ',
                        { embed: embed3 }
                    );
                })
                .catch(function (error) {
                    message.client.channels.cache
                        .get(message.client.errorLog)
                        .send({
                            embed: message.command.discordLogger.errorMessage(
                                error,
                                message.command.errorTypes.API,
                                message.command.name,
                                reqURL
                            ),
                        });
                });
        } else {
            await message.command.axiosConfig
                .get(reqURL)
                .then(function (response) {
                    // handle success
                    const embed4 = new Discord.MessageEmbed()
                        .setColor('#FBCFCF')
                        .setImage(`https://rra.ram.moe${response.data.path}`);
                    return message.channel.send(
                        `${message.author} noms on ${recipient}!`,
                        { embed: embed4 }
                    );
                })
                .catch(function (error) {
                    // handle error
                    message.client.channels.cache
                        .get(message.client.errorLog)
                        .send({
                            embed: message.command.discordLogger.errorMessage(
                                error,
                                message.command.errorTypes.API,
                                message.command.name,
                                reqURL
                            ),
                        });
                });
        }
    }
};
