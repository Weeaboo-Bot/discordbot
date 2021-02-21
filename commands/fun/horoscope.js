const Command = require('../../structures/Command');
const Discord = require('discord.js');
const axios = require('axios');
const {errorMessage} = require('../../util/logHandler');
const ErrorEnum = require('../../util/errorTypes.json');
const signs = [
  'capricorn',
  'aquarius',
  'pisces',
  'aries',
  'taurus',
  'gemini',
  'cancer',
  'leo',
  'virgo',
  'libra',
  'scorpio',
  'sagittarius',
];

module.exports = class HoroscopeCommand extends Command {
  constructor(client) {
    super(client, {
      name : 'horoscope',
      group : 'fun',
      memberName : 'horoscope',
      guildOnly : true,
      description : 'Gets your daily horoscope!',
      examples : [ '!horoscope [sign]' ],
      aliases : [ 'horo', 'sign' ],
      args : [
        {
          key : 'sign',
          type : 'string',
          prompt : 'Please enter your sign',
        },
      ],
    });
  }

  async run(message, {sign}) {
    if (!sign) {
      return message.channel.send(
          'Please give me a sign to get the horoscope of!');
    }

    if (!signs.includes(sign.toLowerCase())) {
      return message.channel.send('That is not a valid sign!');
    }

    await axios.post(`https://aztro.sameerkumar.website?sign=${sign}&day=today`)
        .then(function(res) {
          const msg =
              new Discord
                  .MessageEmbed()

                  .setColor('#F1BE48')
                  .setAuthor(
                      `Horoscope for ${sign} on ${res.data.current_date}`,
                      'http://images.indianexpress.com/2017/01/zodiac-love-2017-main_820_thinkstockphotos-481896132.jpg?w=820')

                  .setTimestamp()
                  .setFooter(`${message.author.username}'s Horoscope`)
                  .addField('Mood', res.data.mood, true)
                  .setDescription(res.data.description)
                  .addField('Color', res.data.color, true)
                  .addField('Lucky Number', res.data.lucky_number, true)
                  .addField('Compatibility', res.data.compatibility, true);

          message.channel.send({embed : msg});
        })
        .catch(function(err) {
          message.client.channel.cache.get(message.client.errorLog).send({
            embed : errorMessage(err, ErrorEnum.API, message.command.name),
          });
        });
  }
};
