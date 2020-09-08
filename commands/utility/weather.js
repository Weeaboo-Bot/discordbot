const Command = require('../../models/Command');
const Discord = require('discord.js');
const axios = require('axios');
const {error_log,weather_token} = require('../../config');
const {errorMessage} = require('../../helpers/logHandler');
const ErrorEnum = require('../../helpers/errorTypes');
function toTitleCase(str) {
    return str.replace(
        /\w\S*/g,
        function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
}



module.exports = class WeatherCommand extends Command{
    constructor(client) {
        super(client, {
            name: 'weather',
            examples: ['!weather 50010','!weather Ames,IA'],
            memberName: 'weather',
            aliases: ['weatherinfo'],
            group: 'utility',
            description: 'Return Weather for a ZIP or City',
            args: [
                {
                    key: 'query',
                    type: 'string',
                    prompt: 'Please Enter a ZIP Code OR City Name'
                }

            ]
        });
    }
   async run(message, {query}){




            // do normal Req
            await axios.get('http://api.weatherapi.com/v1/current.json', {
                params: {
                    'q':query,
                    'key':weather_token
                }
            })
                .then(function(res){


                    const msg = new Discord.MessageEmbed().setColor('#013453')
                            .setTitle(`Weather for ${query}`)
                            .setImage(`https:${res.data.current.condition.icon}`)
                            .setDescription('Current Conditions: ' +  toTitleCase(res.data.current.condition.text) + '\nCurrent Temp: ' + res.data.current.temp_f)
                            .setFooter('Powered by https://weatherapi.com');


                    return message.channel.send({embed: msg});
                })
                .catch(function(err){
                    message.client.channels.cache.get(error_log).send({embed: errorMessage(err,ErrorEnum.API,message.command.name)});
                })



    }

};