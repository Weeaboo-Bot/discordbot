const Command = require('../../structures/Command');
const Discord = require('discord.js');
const { winkP } = require('../../assets/json/actions.json');

// remember to return before every promise
module.exports = class PoutCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'wink',
            group: 'action',
            memberName: 'wink',
            guildOnly: true,
            description: 'Winks at the specified user!',
            examples: ['!wink <mention>'],
        });
    }

    run(message) {
        const recipient = message.content.split(/\s+/g).slice(1).join(' ');
        const wink = winkP[Math.round(Math.random() * (winkP.length - 1))];
        const embed = new Discord.MessageEmbed();

        if (!recipient || message.mentions.users.first() == message.author) {
            embed.setColor('#FBCFCF');
            embed.setImage(wink);
            return message.channel.send(
                `You can't wink at.... yourself, but I'll wink at.. you, ${message.author}!`,
                { embed: embed }
            );
        } else if (message.mentions.users.first() == this.client.user) {
            embed.setColor('#FBCFCF');
            embed.setImage(wink);
            return message.channel.send('(´ω｀*) Y-Yes?', { embed: embed });
        } else {
            embed.setColor('#FBCFCF');
            embed.setImage(wink);
            return message.channel.send(
                `${message.author} winks ${recipient}!`,
                { embed: embed }
            );
        }
    }
};
