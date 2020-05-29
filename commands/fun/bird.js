const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
const axios = require('axios');
const {error_log } = require('../../config');
const {errorMessage} = require('../../functions/errorHandler');
const ErrorEnum = require('../../functions/errorTypes');

module.exports = class BirdCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'bird',
            aliases: ['birb', 'burb', 'birbo'],
            group: 'fun',
            memberName: 'bird',
            guildOnly: true,
            description: 'Sends a random picture of a bird!',
            examples: ['~bird'],
            throttling: {
                usages: 1,
                duration: 5
            }
        });
    }

    async run(message) {


        await axios.get('http://random.birb.pw/tweet/')
            .then(function(res){

                return message.channel.send({ embed: new Discord.MessageEmbed().setImage(`http://random.birb.pw/img/${res.data.image}`)
                        .setFooter('http://random.birb.pw/ ©', 'http://random.birb.pw/img/BPVpe.jpg')
                        .setColor('#71A3BE') });
            })
            .catch(function(err){


                message.client.channels.cache.get(error_log).send({embed: errorMessage(err,ErrorEnum.API,message.command.name)});
                console.log(err)
            })


    }
}