const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
const axios = require('axios');
const {error_log } = require('../../config');
const {errorMessage} = require('../../functions/logHandler');
const ErrorEnum = require('../../functions/errorTypes');
const signs = [
    "capricorn",
    "aquarius",
    "pisces",
    "aries",
    "taurus",
    "gemini",
    "cancer",
    "leo",
    "virgo",
    "libra",
    "scorpio",
    "sagittarius"
]

module.exports = class HoroscopeCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'horoscope',
            group: 'fun',
            memberName: 'horoscope',
            guildOnly: true,
            description: 'Gets your daily horoscope!',
            examples: ['~horoscope [sign]'],
            aliases: ["horo", "sign"],
            throttling: {
                usages: 1,
                duration: 8
            },
            args: [
                {
                    key: 'sign',
                    type: 'string',
                    prompt: 'Please enter your sign'
                }
            ]
        });
    }

    async run(message, {sign}) {

        if (!sign) return message.channel.send("Please give me a sign to get the horoscope of!");

        if (!signs.includes(sign.toLowerCase())) return message.channel.send('That is not a valid sign!');

        await axios.get(`http://sandipbgt.com/theastrologer/api/horoscope/${sign}/today`)
            .then(function(res){
                return message.channel.send({embed: new Discord.MessageEmbed()
                        .setColor('#5D7B9D')
                        .setAuthor(`Horoscope for ${res.data.sunsign} on ${res.data.date}`, 'http://images.indianexpress.com/2017/01/zodiac-love-2017-main_820_thinkstockphotos-481896132.jpg?w=820')
                        .setDescription(res.data.horoscope.replace('(c) Kelli Fox, The Astrologer, http://new.theastrologer.com', ''))
                        .setTimestamp()
                        .setFooter(`${message.author.username}'s Horoscope`)
                        .addField('Mood', res.data.meta.mood, true)
                        .addField("Intensity", res.data.meta.intensity, true)})
            })
            .catch(function(err){
                message.client.channels.cache.get(error_log).send({embed: errorMessage(err,ErrorEnum.API,message.command.name)});
            })





    }
}