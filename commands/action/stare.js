const Command = require('../../structures/Command');
const Discord = require('discord.js');
const { disgustP } = require('../../assets/json/actions.json');

module.exports = class StareCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'stare',
            aliases: ['glare'],
            group: 'action',
            memberName: 'stare',
            guildOnly: true,
            description: 'Stares at the user you mentioned!',
            examples: ['!stare <user>'],
        });
    }

    async run(message) {
        const recipient = message.content.split(/\s+/g).slice(1).join(' ');
        const reqURL = 'https://rra.ram.moe/i/r?type=stare';
        const disgust =
            disgustP[Math.round(Math.random() * (disgustP.length - 1))];
        const embed = new Discord.MessageEmbed();

        if (!recipient || message.mentions.users.first() == message.author) {
            embed.setColor('#FBCFCF');
            embed.setImage(disgust);
            return message.channel.send(
                `${message.author} stares at... themselves..?`,
                { embed: embed }
            );
        } else if (message.mentions.users.first() == this.client.user) {
            await message.command.axiosConfig
                .get(reqURL)
                .then(function (res) {
                    embed.setColor('#FBCFCF');
                    embed.setImage(`https://rra.ram.moe${res.data.path}`);
                    return message.channel.send('Y-Yes? (๑´•ω • `๑)', {
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
                    embed.setColor('#FBCFCF');
                    embed.setImage(`https://rra.ram.moe${res.data.path}`);
                    return message.channel.send(
                        `${message.author} stares at ${recipient}...`,
                        { embed: embed }
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
