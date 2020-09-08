const Command = require('../../models/Command');
const Discord = require('discord.js');
const axios = require('axios');
const {error_log} = require('../../config');
const {disgustP} = require('../../assets/json/actions.json');
const {errorMessage} = require('../../helpers/logHandler');
const ErrorEnum = require('../../helpers/errorTypes');

module.exports = class StareCommand extends Command {
  constructor(client) {
    super(client, {
      name : 'stare',
      aliases : [ 'glare' ],
      group : 'action',
      memberName : 'stare',
      guildOnly : true,
      description : 'Stares at the user you mentioned!',
      examples : [ '~stare <user>' ],
      throttling : {usages : 1, duration : 3}
    });
  }

  async run(message) {
    var recipient = message.content.split(/\s+/g).slice(1).join(" ");
    var disgust = disgustP[Math.round(Math.random() * (disgustP.length - 1))];

    if (!recipient) {
      var embed =
          new Discord.MessageEmbed().setColor('#FBCFCF').setImage(disgust);
      return message.channel.send(
          `${message.author} stares at... themselves..?`, {embed : embed});

    } else if (message.mentions.users.first() == message.author) {
      var embed =
          new Discord.MessageEmbed().setColor('#FBCFCF').setImage(disgust);
      return message.channel.send(
          `${message.author} stares at... themselves..?`, {embed : embed});

    } else if (message.mentions.users.first() == this.client.user) {

      await axios.get('https://rra.ram.moe/i/r?type=stare')
          .then(function(res) {
            var embed = new Discord.MessageEmbed().setColor('#FBCFCF').setImage(
                `https://rra.ram.moe${res.data.path}`);
            return message.channel.send(`Y-Yes? (๑´•ω • \`๑)`, {embed : embed});
          })
          .catch(function(err) {
            message.client.channels.cache.get(error_log).send({
              embed : errorMessage(err, ErrorEnum.API, message.command.name)
            });
          })

    } else {

      await axios.get('https://rra.ram.moe/i/r?type=stare')
          .then(function(res) {
            var embed = new Discord.MessageEmbed().setColor('#FBCFCF').setImage(
                `https://rra.ram.moe${res.data.path}`);
            return message.channel.send(
                `${message.author} stares at ${recipient}...`, {embed : embed});
          })
          .catch(function(err) {
            message.client.channels.cache.get(error_log).send({
              embed : errorMessage(err, ErrorEnum.API, message.command.name)
            });
          })
    }
  }
};