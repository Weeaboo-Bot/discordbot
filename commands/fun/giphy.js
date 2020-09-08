const Command = require('../../models/Command');
const Discord = require('discord.js');
const axios = require('axios');
const {error_log} = require('../../config');
const {errorMessage} = require('../../helpers/logHandler');
const ErrorEnum = require('../../helpers/errorTypes');
const {giphy_key} = require('../../config');

module.exports = class GiphyCommand extends Command {
  constructor(client) {
    super(client, {
      name : 'giphy',
      group : 'fun',
      aliases : [ 'gif' ],
      memberName : 'giphy',
      description : 'Searches Giphy for gifs!',
      examples : [ '~giphy [tags]' ],
      args : [ {
        key : 'query',
        prompt : 'Please provide me a term to search for!',
        type : 'string',
        default : 'wtf'
      } ]
    });
  }

  async run(message, {query}) {

    await axios
        .get('http://api.giphy.com/v1/gifs/search', {
          params : {
            q : query,
            api_key : giphy_key,
            rating : message.channel.nsfw ? 'r' : 'pg',
            limit : 5
          }
        })
        .then(function(res) {
          if (!res.data.length)
            return message.channel.send(`No results found for **${query}**!`);
          const random = Math.floor(Math.random() * res.data.length);

          return message.channel.send({
            embed : new Discord.MessageEmbed()
                        .setImage(res.data[random].images.original.url)
                        .setColor("#ADC4CC")
          })
        })
        .catch(function(err) {
          message.client.channels.cache.get(error_log).send(
              {embed : errorMessage(err, ErrorEnum.API, message.command.name)});
        })
  }
};