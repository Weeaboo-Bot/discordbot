const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
const axios = require('axios');
const {error_log} = require('../../config');
const { disgustP } = require('../../assets/json/actions.json');

module.exports = class NomCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'nom',
            aliases: ['eat', 'munch'],
            group: 'action',
            memberName: 'nom',
            guildOnly: true,
            description: 'Noms on the user you mentioned!',
            examples: ['~nom <user>'],
            throttling: {
                usages: 1,
                duration: 3
            }
        });
    }

    async run(message, args) {
        var disgust = disgustP[Math.round(Math.random() * (disgustP.length - 1))];

        if (args.length < 1) {
            var embed = new Discord.MessageEmbed()
                .setColor('#FBCFCF')
                .setImage(disgust)
            return message.channel.send(`${message.author} noms on... themselves..?`, { embed: embed })

        } else if (message.mentions.users.first() == message.author) {
            var embed = new Discord.MessageEmbed()
                .setColor('#FBCFCF')
                .setImage(disgust)
            return message.channel.send(`${message.author} noms on... themselves..?`, { embed: embed })

        } else if (message.mentions.users.first() == this.client.user) {



            await axios.get('https://rra.ram.moe/i/r?type=nom')
                .then(function (response) {
                    // handle success
                    var embed = new Discord.MessageEmbed()
                        .setColor('#FBCFCF')
                        .setImage(`https://rra.ram.moe${response.data.path}`)
                    return message.channel.send(`Nyaa~ s-senpai... (´Å\`∗)... `, { embed: embed })

                })
                .catch(function (error) {
                    // handle error
                    //message.client.channels.cache.get(error_log).send(error);
                    console.log(error);
                });



        } else {




            await axios.get('https://rra.ram.moe/i/r?type=nom')
                .then(function (response) {
                    // handle success
                    var embed = new Discord.MessageEmbed()
                        .setColor('#FBCFCF')
                        .setImage(`https://rra.ram.moe${response.data.path}`)
                    return message.channel.send(`${message.author} noms on ${recipient}!`, { embed: embed })

                })
                .catch(function (error) {
                    // handle error
                    console.log(error);
                });

        }
    }
}