const Command = require('../../structures/Command');
const Discord = require('discord.js');
const booru = require('booru');
const errors = require('../../assets/json/errors');

module.exports = class KonachanCommand extends Command {
  constructor(client) {
    super(client, {
      name : 'konachan',
      aliases : [ 'kona', 'kc' ],
      group : 'nsfw',
      memberName : 'konachan',
      guildOnly : true,
      description : 'Searches for images on Konachan!',
      details : 'This command can only be used in NSFW channels!',
      examples : [ '~konachan <search>' ],
      throttling : {
        usages : 1,
        duration : 3,
      },
    });
  }

  run(message) {
    const errMessage = errors[Math.round(Math.random() * (errors.length - 1))];
    if (!message.channel.nsfw) {
      message.react('💢');
      return message.channel.send(errMessage);
    }

    if (message.content.toUpperCase().includes('LOLI') ||
        message.content.toUpperCase().includes('GORE'))
      return message.channel.send(
          'That kind of stuff is not allowed! Not even in NSFW channels!');

    const query = message.content.split(/\s+/g).slice(1).join(' ');
    booru.search('konac', [ query ], {limit : 1, random : true})
        .then(booru.commonfy)
        .then((images) => {
          for (const image of images) {
            const embed =
                new Discord.MessageEmbed()
                    .setAuthor(`Konachan ${query}`,
                               'https://b.catgirlsare.sexy/NrAI.png')
                    .setDescription(`[Image URL](${image.common.file_url})`)
                    .setImage(image.common.file_url)
                    .setColor('#E89F3E');
            return message.channel.send({embed});
          }
        })
        .catch((err) => {
          if (err.name === 'booruError') {
            return message.channel.send(`No results found for **${query}**!`);
          } else {
            return message.channel.send(`No results found for **${query}**!`);
          }
        });
  }
};
