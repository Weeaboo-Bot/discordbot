const Command = require('../../structures/Command');
const Discord = require('discord.js');
const { disgustP } = require('../../assets/json/actions.json');

module.exports = class TickleCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'tickle',
            group: 'action',
            memberName: 'tickle',
            guildOnly: true,
            description: 'Tickles the user you mentioned!',
            examples: ['!tickle <user>'],
        });
    }

    async run(message) {
        const recipient = message.content.split(/\s+/g).slice(1).join(' ');
        const reqURL = 'https://rra.ram.moe/r?type=tickle';
        const disgust =
            disgustP[Math.round(Math.random() * (disgustP.length - 1))];

        if (!recipient) {
            var embed = new Discord.MessageEmbed()
                .setColor('#FBCFCF')
                .setImage(disgust);
            return message.channel.send(
                `${message.author} tickles... themselves..?`,
                { embed: embed }
            );
        } else if (message.mentions.users.first() == message.author) {
            var embed = new Discord.MessageEmbed()
                .setColor('#FBCFCF')
                .setImage(disgust);
            return message.channel.send(
                `${message.author} tickles... themselves..?`,
                { embed: embed }
            );
        } else if (message.mentions.users.first() == this.client.user) {
            await message.command.axiosConfig
                .get(reqURL)
                .then(function (res) {
                    const embed = new Discord.MessageEmbed()
                        .setColor('#FBCFCF')
                        .setImage(`https://rra.ram.moe${res.data.path}`);
                    return message.channel.send('NyaAhaha! ⊂(( ^ ▽ ^ ))⊃', {
                        embed: embed,
                    });
                })
                .catch(function (err) {
                    message.client.channel.cache
                        .get(message.client.errorLog)
                        .send({
                            embed: message.command.discordLogger.errorMessage(
                                err,
                                message.command.errorTypes.API,
                                message.command.name,
                                reqURL
                            ),
                        });
                });
        } else {
            await message.command.axiosConfig
                .get(reqURL)
                .then(function (res) {
                    return message.channel.send(
                        `${message.author} tickles ${recipient}!`,
                        {
                            embed: new Discord.MessageEmbed()
                                .setColor('#FBCFCF')
                                .setImage(
                                    `https://rra.ram.moe${res.data.path}`
                                ),
                        }
                    );
                })
                .catch(function (err) {
                    message.client.channel.cache
                        .get(message.client.errorLog)
                        .send({
                            embed: message.command.discordLogger.errorMessage(
                                err,
                                message.command.errorTypes.API,
                                message.command.name,
                                reqURL
                            ),
                        });
                });
        }
    }
};
