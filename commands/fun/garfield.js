const Command = require('../../structures/Command');
const Discord = require('discord.js');
const { randomNumber, garfieldDay, garfieldURL } = require('../../util/Util');

module.exports = class GarfieldCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'garfield',
            guildOnly: true,
            aliases: ['gar', 'comic'],
            group: 'fun',
            memberName: 'garfield',
            description: 'garfield',
            examples: ['!garfield'],
        });
    }

    run(message) {
        const year = randomNumber(1990, 2016);
        const month = randomNumber(1, 12);
        const day = garfieldDay(month, year);
        const garURL = garfieldURL(day, month, year);

        const embed = new Discord.MessageEmbed()
            .setColor('#E16935')
            .setFooter(`Published in ${year}`)
            .setDescription(`[Image URL](${garURL})`)
            .setImage(garURL);
        message.channel.send({ embed });
    }
};
