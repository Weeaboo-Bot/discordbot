const Command = require('../../structures/Command');
const Discord = require('discord.js');
const { noSwearP } = require('../../assets/json/actions.json');

module.exports = class PoutCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'noswearing',
            aliases: ['sorrysir', 'noswear'],
            group: 'action',
            memberName: 'noswearing',
            guildOnly: true,
            description:
                'Sorry sir no swearing in my Christian Minecraft server',
            examples: ['!wink <mention>'],
        });
    }

    run(message) {
        const recipient = message.content.split(/\s+/g).slice(1).join(' ');
        const noSwear =
            noSwearP[Math.round(Math.random() * (noSwearP.length - 1))];
        const embed = new Discord.MessageEmbed();

        if (!recipient) {
            embed.setColor('#FBCFCF');
            embed.setImage(noSwear);
            return message.channel.send(
                '**NO SWEARING! <:NOSWEARING:379103012007706624>**',
                { embed: embed }
            );
        } else {
            embed.setColor('#FBCFCF');
            embed.setImage(noSwear);
            return message.channel.send(`${recipient}, NO SWEARING!`, {
                embed: embed,
            });
        }
    }
};
