const {Command } = require('discord.js-commando');
const Discord = require('discord.js');
const axios = require('axios');
const {error_log} = require('../../config');
const {errorMessage} = require('../../functions/logHandler');
const ErrorEnum = require('../../functions/errorTypes')
const { disgustP } = require('../../assets/json/actions.json');
//const {suv}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
}



module.exports = class NSFWCommand extends Command{
    constructor(client) {
        super(client, {
            name: 'nsfw',
            description: 'Search for NSFW Pics based on requested SubList',
            memberName: 'nsfw',
            group: 'nsfw',
            aliases: ['nsfwpics','pornpics'],
            examples: ['!nsfw 4knsfw','!nsfw pussy'],
            args: [
                {
                    key: 'subList',
                    type: 'string',
                    prompt: 'Please enter the category to search'
                }
            ]
        });

    }
    async run(message,{subList}){


        await axios.get(`https://www.reddit.com/r/${subList[ getRndInteger(0,subList.length)]}.json`)
            .then(function(res) {

                for(var value in res.data.data.children){
                    var index = getRndInteger(0,res.data.data.children.length);
                    const embed = new Discord.MessageEmbed()
                        .setFooter()
                        .setDescription(`[Image URL](${res.data.data.children[getRndInteger(0,res.data.data.children.length)].data.permalink})`)
                        .setImage(res.data.data.children[getRndInteger(0,res.data.data.children.length)].data.url)
                        .setColor('#A187E0');
                    return message.channel.send({ embed });

                }


            })
            .catch(function (error) {
                // handle error

                message.client.channels.cache.get(error_log).send({embed: errorMessage(error,ErrorEnum.API,message.command.name)});

            });

    }


}