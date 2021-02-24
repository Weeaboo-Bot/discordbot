const Command = require('../../structures/Command');
const Discord = require('discord.js');
const { slapP } = require('../../assets/json/actions.json');

module.exports = class SlapCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'slap',
            aliases: ['punch', 'hit', 'punish'],
            group: 'action',
            memberName: 'slap',
            guildOnly: true,
            description: 'Slaps the user you mentioned!',
            examples: ['!slap <user>'],
        });
    }

    run(message) {
        function selfSlap() {
            const rand = [
                'http://cdn.awwni.me/mz98.gif',
                'https://media.giphy.com/media/UxFtCk3f62uGI/200.gif',
            ];
            return rand[Math.floor(Math.random() * rand.length - 1)];
        }

        const recipient = message.content.split(/\s+/g).slice(1).join(' ');
        const slap = slapP[Math.round(Math.random() * (slapP.length - 1))];
        const embed = new Discord.MessageEmbed();

        if (!recipient || message.mentions.users.first() == message.author) {
            embed.setColor('#FBCFCF');
            embed.setImage(selfSlap());
            return message.channel.send(
                `${message.author}, please don't slap yourself!`,
                { embed: embed }
            );
        } else if (message.mentions.users.first() == this.client.user) {
            return message.channel.send(
                "(；︿ ；✿) I-I'm sorry.. please d-don't slap me..."
            );
        } else {
            embed.setColor('#FBCFCF');
            embed.setImage(slap);
            return message.channel.send(
                `${message.author} slaps ${recipient}!`,
                { embed: embed }
            );
        }
    }
};
