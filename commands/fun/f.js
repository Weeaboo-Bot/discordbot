const Command = require('../../structures/Command');
const Discord = require('discord.js');

module.exports = class FCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'f',
            aliases: ['respect', 'respects', 'rip'],
            group: 'fun',
            memberName: 'f',
            guildOnly: true,
            description: 'Press F to pay respects',
            examples: ['!f <something you want to respect>'],
            args: [
                {
                    key: 'respect',
                    prompt: 'Please provide me something to respect!',
                    type: 'string',
                    default: 'none',
                },
            ],
        });
    }

    run(message, args) {
        const { respect } = args;
        const embed = new Discord.MessageEmbed();
        if (respect == 'none') {
            embed.setAuthor(
                `${message.author.username} has paid their respects.`,
                message.author.displayAvatarURL({ format: 'png' })
            );
            embed.setColor('#4E373B');
            embed.setFooter('Press F to pay your respects.');
            message.channel.send({ embed }).then((m) => m.react('🇫'));

            return null;
        } else {
            embed.setAuthor(
                '\u2000',
                message.author.displayAvatarURL({ format: 'png' })
            );
            embed.setColor('#4E373B');
            embed.setDescription(
                `${message.author} has paid their respects to ${respect}`
            );
            embed.setFooter('Press F to pay your respects.');
            message.channel.send({ embed }).then((m) => m.react('🇫'));

            return null;
        }
    }
};
