const Command = require('../../structures/Command');
const Discord = require('discord.js');
const { randomNumber } = require('../../util/Util');

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

        function leapYear(yr) {
            return (yr % 4 === 0 && yr % 100 !== 0) || yr % 400 === 0;
        }

        function garfieldDay(month, year) {
            let day = 0;
            if (
                month === 1 ||
                month === 3 ||
                month === 5 ||
                month === 7 ||
                month === 8 ||
                month === 10 ||
                month === 12
            ) {
                day = randomNumber(1, 31);
            } else if (month === 2) {
                if (leapYear(year) === true) {
                    day = randomNumber(1, 29);
                } else {
                    day = randomNumber(1, 28);
                }
            } else {
                day = randomNumber(1, 30);
            }
            return day;
        }

        function garfieldURL(day, month, year) {
            let yearURL = 0;
            let garURL = '';
            if (year < 2000) {
                yearURL = year - 1900;
            } else {
                yearURL = year - 2000;
            }

            if (yearURL < 10) {
                garURL =
                    garURL +
                    'http://images.ucomics.com/comics/ga/' +
                    year +
                    '/ga' +
                    '0' +
                    yearURL;
            } else {
                garURL =
                    garURL +
                    'http://images.ucomics.com/comics/ga/' +
                    year +
                    '/ga' +
                    yearURL;
            }

            if (month < 10) {
                garURL = garURL + '0' + month;
            } else {
                garURL = garURL + month;
            }

            if (day < 10) {
                garURL = garURL + '0' + day + '.gif';
            } else {
                garURL = garURL + day + '.gif';
            }

            return garURL;
        }

        const embed = new Discord.MessageEmbed()
            .setColor('#E16935')
            .setFooter(`Published in ${year}`)
            .setDescription(`[Image URL](${garURL})`)
            .setImage(garURL);
        message.channel.send({ embed });
    }
};
