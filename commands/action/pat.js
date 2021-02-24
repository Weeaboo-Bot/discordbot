const Command = require('../../structures/Command');
const Discord = require('discord.js');
const { patP } = require('../../assets/json/actions.json');

module.exports = class PatCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'pat',
            aliases: ['pet'],
            group: 'action',
            memberName: 'pat',
            guildOnly: true,
            description: 'Pats the user you mentioned on the head!',
            examples: ['!pat <user>'],
        });
    }

    run(message) {
        const recipient = message.content.split(/\s+/g).slice(1).join(' ');
        const pat = patP[Math.round(Math.random() * (patP.length - 1))];
        const embed = new Discord.MessageEmbed();

        if (!recipient || message.mentions.users.first() == message.author) {
            embed.setColor('#FBCFCF');
            embed.setImage(pat);
            return message.channel.send(
                `${message.author}, you can't pat yourself, but I'll pat you! (´꒳\`)`,
                { embed: embed }
            );
        } else if (message.mentions.users.first() == this.client.user) {
            embed.setColor('#FBCFCF');
            embed.setImage(pat);
            return message.channel.send(
                "H-Haa.. (✿´ ꒳ ` ) please don't stop...",
                { embed: embed }
            );
        } else {
            embed.setColor('#FBCFCF');
            embed.setImage(pat);
            return message.channel.send(
                `${message.author} pats ${recipient}!`,
                { embed: embed }
            );
        }
    }
};
