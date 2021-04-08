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
        const disgust =
            disgustP[Math.round(Math.random() * (disgustP.length - 1))];

        if (!recipient) {
            var embed = new Discord.MessageEmbed()
                .setColor('#FBCFCF')
                .setImage(disgust);
            return message.channel.send(
                `${message.author} stares at... themselves..?`,
                { embed: embed }
            );
        } else if (message.mentions.users.first() == message.author) {
            var embed = new Discord.MessageEmbed()
                .setColor('#FBCFCF')
                .setImage(disgust);
            return message.channel.send(
                `${message.author} stares at... themselves..?`,
                { embed: embed }
            );
        } else if (message.mentions.users.first() == this.client.user) {
            await this.apiReq
                .get('https://rra.ram.moe/i/r?type=stare')
                .then(function (res) {
                    const embed = new Discord.MessageEmbed()
                        .setColor('#FBCFCF')
                        .setImage(`https://rra.ram.moe${res.data.path}`);
                    return message.channel.send('Y-Yes? (๑´•ω • `๑)', {
                        embed: embed,
                    });
                })
                .catch(function (err) {
                    message.client.channel.cache
                        .get(message.client.botLogger)
                        .send({
                            embed: message.client.errorMessage(
                                err,
                                message.client.errorTypes.API,
                                message.command.name
                            ),
                        });
                });
        } else {
            await this.apiReq
                .get('https://rra.ram.moe/i/r?type=stare')
                .then(function (res) {
                    const embed = new Discord.MessageEmbed()
                        .setColor('#FBCFCF')
                        .setImage(`https://rra.ram.moe${res.data.path}`);
                    return message.channel.send(
                        `${message.author} stares at ${recipient}...`,
                        { embed: embed }
                    );
                })
                .catch(function (err) {
                    message.client.botLogger
                        .send({
                            embed: message.client.errorMessage(
                                err,
                                message.client.errorTypes.API,
                                message.command.name
                            ),
                        });
                });
        }
    }
};
