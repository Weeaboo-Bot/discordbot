const Command = require('../../structures/Command');
const Discord = require('discord.js');
const { toTitleCase } = require('../../util/Util');

module.exports = class AirQualityCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'aqi',
            examples: ['!aqi 19102'],
            memberName: 'aqi',
            aliases: ['airquality', 'airqualityindex'],
            group: 'core',
            description: 'Return Weather for a City',
            args: [
                {
                    key: 'zip',
                    label: 'which zip code to lookup',
                    type: 'string',
                    prompt: 'Please Enter a Zip Code',
                },
            ],
        });
    }
    async run(message, { zip }) {
        // do normal Req
        await this.apiReq
            .get('https://www.airnowapi.org/aq/forecast/zipCode/', {
                params: {
                    zipCode: zip,
                    format: 'application/json',
                    API_KEY: message.client.apiKeys.AIRNOW_API,
                },
            })
            .then(function (res) {
                const msg = new Discord.MessageEmbed()
                    .setColor('#013453')
                    .setTitle(`AQI for ${zip}`)
                    .setImage()
                    .setDescription(
                        'Current AQI (PM 2.5) for : ' +
                            toTitleCase(res.data[0].ReportingArea + ',' + res.data[0].StateCode) +
                            '\nCurrent AQI: ' +
                            res.data[0].AQI
                    )
                    .setFooter('Powered by https://airnowapi.org');

                return message.channel.send({ embed: msg });
            })
            .catch(function (err) {
                message.client.botLogger
                    ({
                        embed: message.client.errorMessage(
                            message.client.logger,
                            err,
                            message.client.errorTypes.API,
                            message.command.name
                        ),
                    });
            });
    }
};
