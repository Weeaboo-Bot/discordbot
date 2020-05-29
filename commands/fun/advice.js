const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
const axios = require('axios');
const {error_log} = require('../../config');


module.exports = class AdviceCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'advice',
            group: 'fun',
            memberName: 'advice',
            guildOnly: true,
            description: 'Get some advice!',
            examples: ['~advice'],
            throttling: {
                usages: 1,
                duration: 3
            }
        });
    }

    async run(message) {


        await axios.get('http://api.adviceslip.com/advice')
            .then(function(res){
                try {
                    const embed = new Discord.MessageEmbed()
                        .setAuthor(`Here's some advice!`, 'https://a.safe.moe/BVBr9.png')
                        .setDescription(res.data.advice.slip.advice)
                        .setColor('#727684');
                    return message.channel.send({ embed });

                } catch (err) {
                    return message.channel.send(`<:NOTLIKETHIIIIIIIIIIIIIIIIIIIIIIS:371071292146843658> Sorry! My API isn't working!`)
                }
            })
            .catch(function(err){
                const channel = client.channels.fetch(error_log);
                channel.send(err);
                console.log(err)
            })


    }
}