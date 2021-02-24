const Command = require('../../structures/Command');
const Discord = require('discord.js');
const { pokeP } = require('../../assets/json/actions.json');

module.exports = class PokeCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'poke',
            aliases: ['pokeyou'],
            group: 'action',
            memberName: 'poke',
            guildOnly: true,
            description: 'POke the user you mentioned!',
            examples: ['!poke <user>'],
            args: [
                {
                    key: 'user',
                    label: 'which user to poke',
                    prompt: 'Please provide me a user to poke!',
                    type: 'user',
                },
            ],
        });
    }

    run(message, { user }) {
        const recipient = user;
        const poke = pokeP[Math.round(Math.random() * (pokeP.length - 1))];
        const embed = new Discord.MessageEmbed();

        if (!recipient || message.mentions.users.first() == message.author) {
            embed.setColor('#FBCFCF');
            embed.setImage(poke);
            message.delete();
            return message.channel.send(
                `${message.author}, you can't poke yourself, but I'll poke you! (´꒳\`)`,
                { embed: embed }
            );
        } else if (message.mentions.users.first() == this.client.user) {
            embed.setColor('#FBCFCF');
            embed.setImage(poke);
            message.delete();
            return message.channel.send(
                "H-Haa.. (✿´ ꒳ ` ) please don't stop...",
                { embed: embed }
            );
        } else {
            embed.setColor('#FBCFCF');
            embed.setImage(poke);
            message.delete();
            return message.channel.send(
                `${message.author} pokes ${recipient}!`,
                { embed: embed }
            );
        }
    }
};
