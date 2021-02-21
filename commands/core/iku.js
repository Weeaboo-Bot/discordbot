const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const iku = require('../../assets/json/iku.json');

module.exports = class IkuCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'iku',
            guildOnly: true,
            aliases: ['bestgirl', 'i19'],
            group: 'core',
            memberName: 'iku',
            description: "Iku is best girl and there's no denying it!!",
            examples: ['!iku'],
        });
    }

    run(message) {
        const embed = new MessageEmbed()
            .setColor('#FBCFCF')
            .setImage(iku[Math.round(Math.random() * (iku.length - 1))]);
        return message.channel.send({ embed });
    }
};
