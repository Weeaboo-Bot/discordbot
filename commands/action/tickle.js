const Command = require('../../structures/Command');
const Discord = require('discord.js');
const axios = require('axios');
const { disgustP } = require('../../assets/json/actions.json');
const LogHandler = require('../../util/logHandler');
const ErrorEnum = require('../../assets/json/errorTypes.json');

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
        const LOG = new LogHandler();
        const recipient = message.content.split(/\s+/g).slice(1).join(' ');
        const reqURL = 'https://rra.ram.moe/r?type=tickle';
        const disgust =
            disgustP[Math.round(Math.random() * (disgustP.length - 1))];
        const embed = new Discord.MessageEmbed();

        if (!recipient || message.mentions.users.first() == message.author) {
            embed.setColor('#FBCFCF');
            embed.setImage(disgust);
            return message.channel.send(
                `${message.author} tickles... themselves..?`,
                { embed: embed }
            );
        } else if (message.mentions.users.first() == this.client.user) {
            await axios
                .get(reqURL)
                .then(function (res) {
                    embed.setColor('#FBCFCF');
                    embed.setImage(`https://rra.ram.moe${res.data.path}`);
                    return message.channel.send('NyaAhaha! ⊂(( ^ ▽ ^ ))⊃', {
                        embed: embed,
                    });
                })
                .catch(function (err) {
                    message.client.channel.cache
                        .get(message.client.errorLog)
                        .send({
                            embed: LOG.errorMessage(
                                err,
                                ErrorEnum.API,
                                message.command.name,
                                reqURL
                            ),
                        });
                });
        } else {
            await axios
                .get(reqURL)
                .then(function (res) {
                    embed.setColor('#FBCFCF');
                    embed.setImage(`https://rra.ram.moe${res.data.path}`);
                    return message.channel.send(
                        `${message.author} tickles ${recipient}!`,
                        { embed: embed }
                    );
                })
                .catch(function (err) {
                    message.client.channel.cache
                        .get(message.client.errorLog)
                        .send({
                            embed: LOG.errorMessage(
                                err,
                                ErrorEnum.API,
                                message.command.name,
                                reqURL
                            ),
                        });
                });
        }
    }
};
