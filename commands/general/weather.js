const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
const cheerio = require('cheerio');
const { weather_token } = require('../../config');


function toTitleCase(str) {
    return str.replace(
        /\w\S*/g,
        function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
}



module.exports = class WeatherCommand extends Command {
    constructor(client) {
      super(client, {
        name: 'weather',
        memberName: 'weather',
        description:
          'Get Current Weather for a ZIP Code',
        group: 'general',
        throttling: {
          usages: 1,
          duration: 5
        },
        args: [
          {
            key: 'zipCode',
            type: 'string',
            prompt: 'What ZIP Code would you like to get weather for ?'
          }
        ]
      });
    }
    async run(message, { zipCode }) {
        
      
    
        // text needs to be less than 3000 length
    
        
    
    
        try {
          var res = await fetch(
            // Powered by OpenWeatherAPI
            `https://api.openweathermap.org/data/2.5/weather?zip=${zipCode}&appid=${weather_token}&units=Imperial`
          );
          const json = await res.json();
          message.channel.send(embedWeather(json.weather,json.main.temp));
        } catch (e) {
          console.error(e);
          return message.say(
            'Something went wrong when trying to load Weather Data'
          );
        }
    
        function embedWeather(weather_data,temp_data) {
          return new MessageEmbed()
            .setColor('#FF0000')
            .setTitle(`Weather for ${zipCode}`)
            .setURL('https://openweathermap.org/')
            .setImage(`https://openweathermap.org/img/wn/${weather_data[0].icon}@4x.png`)
            
            .setDescription('Current Conditions: ' +  toTitleCase(weather_data[0].description) + '\nCurrent Temp: ' + temp_data + ' \u2109')
            
            .setFooter('Powered by openweathermap.org');
        }
      }
  };
