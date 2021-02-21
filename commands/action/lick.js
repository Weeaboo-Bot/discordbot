const Command = require('../../structures/Command');
const Discord = require('discord.js');
const { disgustP } = require('../../assets/json/actions.json');

module.exports = class LickCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'lick',
            aliases: ['slurp'],
            group: 'action',
            memberName: 'lick',
            guildOnly: true,
            description: 'Licks the user you mentioned!',
            examples: ['!lick <user>'],
        });
    }

  async run(message) {
    const reqURL = 'https://rra.ram.moe/i/r?type=lick';
        const recipient = message.content.split(/\s+/g).slice(1).join(' ');
    const disgust = disgustP[Math.round(Math.random() * (disgustP.length - 1))];
    const embed = new Discord.MessageEmbed();

    if (!recipient || message.mentions.users.first() == message.author) {
      embed.setColor('#FBCFCF');
      embed.setImage(disgust);
      return message.channel.send(`${message.author} licks... themselves..?`,
                                  {embed : embed});
    } else if (message.mentions.users.first() == this.client.user) {
      await message.command.axiosConfig.get(reqURL)
          .then(function(res) {
            embed.setColor('#FBCFCF');
            embed.setImage(`https://rra.ram.moe${res.data.path}`);
            return message.channel.send(
                'Nyaa..♡(｡￫ˇ艸￩) where are you...licking me...',
                {embed : embed});
          })
          .catch(function(error) {
            // handle error

            message.client.channels.cache.get(message.client.errorLog).send({
              embed : message.command.discordLogger.errorMessage(error, message.command.errorTypes.API, message.command.name,
                                reqURL),
            });
          });
    } else {
      await message.command.axiosConfig.get(reqURL)
          .then(function(res) {
            embed.setColor('#FBCFCF');
            embed.setImage(`https://rra.ram.moe${res.data.path}`);
            return message.channel.send(`${message.author} licks ${recipient}!`,
                                        {embed : embed});
          })
          .catch(function(error) {
            // handle error
            message.client.channels.cache
                        .get(message.client.errorLog)
                        .send({
                            embed: message.command.discordLogger.errorMessage(
                                error,
                                message.command.errorTypes.API,
                                message.command.name,
                                reqURL
                            ),
                        });
          });
    }
  }
};
