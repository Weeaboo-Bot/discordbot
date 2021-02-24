const Command = require('../../structures/Command');
const Discord = require('discord.js');
const { toTitleCase } = require('../../util/Util');

module.exports = class WeatherCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'weather',
            examples: ['!weather 50010', '!weather Ames,IA'],
            memberName: 'weather',
            aliases: ['weatherinfo'],
            group: 'core',
            description: 'Return Weather for a ZIP or City',
            args: [
                {
                    key: 'query',
                    type: 'string',
                    prompt: 'Please Enter a ZIP Code OR City Name',
                },
            ],
        });
    }
    async run(message, { query }) {
        const reqURL = 'http://api.weatherapi.com/v1/current.json';
        // do normal Req
        await message.command.axiosConfig
            .get(reqURL, {
                params: {
                    q: query,
                    key: message.client.apiKeys.WEATHER_KEY,
                },
            })
            .then(function (res) {
                const msg = new Discord.MessageEmbed()
                    .setColor('#013453')
                    .setTitle(`Weather for ${query}`)
                    .setImage(`https:${res.data.current.condition.icon}`)
                    .setDescription(
                        'Current Conditions: ' +
                            toTitleCase(res.data.current.condition.text) +
                            '\nCurrent Temp: ' +
                            res.data.current.temp_f
                    )
                    .setFooter('Powered by https://weatherapi.com');

                return message.channel.send({ embed: msg });
            })
            .catch(function (err) {
                message.client.channels.cache
                    .get(message.client.errorLog)
                    .send({
                        embed: message.command.discordLogger.errorMessage(
                            err,
                            message.command.errorTypes.API,
                            message.command.name,
                            reqURL
                        ),
                    });
            });
    }
};
