const Command = require('../../models/Command');
const Discord = require('discord.js');
const { hugP } = require('../../assets/json/actions.json');

module.exports = class HugCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'hug',
            aliases: ['cuddle'],
            group: 'action',
            memberName: 'hug',
            guildOnly: true,
            description: 'Hugs the user you mentioned!',
            examples: ['~hug <user>'],
            throttling: {
                usages: 1,
                duration: 3
            }
        });
    }

    run(message) {
        var recipient = message.content.split(/\s+/g).slice(1).join(" ");
        var hug = hugP[Math.round(Math.random() * (hugP.length - 1))];

        if (!recipient) {
            const embed = new Discord.MessageEmbed()
                .setColor('#FBCFCF')
                .setImage(hug);
            return message.channel.send(`You can't hug yourself, but I'll hug you, ${message.author}!`, { embed: embed });

        } else if (message.mentions.users.first() == message.author) {
            const embed = new Discord.MessageEmbed()
                .setColor('#FBCFCF')
                .setImage(hug);
            return message.channel.send(`You can't hug yourself, but I'll hug you, ${message.author}!`, { embed: embed });

        } else if (message.mentions.users.first() == this.client.user) {
            const embed = new Discord.MessageEmbed()
                .setColor('#FBCFCF')
                .setImage(hug);
            return message.channel.send(`ల(\*´= ◡ =｀\*) Such a warm hug..thank you~~ Nyaa~~`, { embed: embed });

        } else {
            const embed = new Discord.MessageEmbed()
                .setColor('#FBCFCF')
                .setImage(hug);
            return message.channel.send(`${message.author} hugs ${recipient}!`, { embed: embed });
        }
    }
};