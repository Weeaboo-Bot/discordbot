const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
const axios = require('axios');
const errors = require('../../assets/json/errors');
const {error_log} = require('../../config');
const {errorMessage} = require('../../functions/logHandler');
const ErrorEnum = require('../../functions/errorTypes')
const { disgustP } = require('../../assets/json/actions.json');


function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
}


module.exports = class FourKNSFWCommand extends Command {
    constructor(client) {
        super(client, {
            name: '4knsfw',
            aliases: ['hdnsfw', 'hqnsfw'],
            group: 'nsfw',
            memberName: '4knsfw',
            guildOnly: true,
            nsfw: true,
            description: 'Finds high quality NSFW content for you!',
            details: 'This command can only be used in NSFW channels!',
            examples: ['~4knsfw'],
            throttling: {
                usages: 1,
                duration: 3
            }
        });
    }

 async   run(message) {

        var subreddits = [
            'nsfw_wallpapers',
            'SexyWallpapers',
            'HighResNSFW',
            'nsfw_hd',
            'UHDnsfw'
        ]




        await axios.get(`https://www.reddit.com/r/${subreddits[ getRndInteger(0,subreddits.length)]}.json`)
            .then(function(res) {

                for(var value in res.data.data.children){
                    var index = getRndInteger(0,res.data.data.children.length);
                    const embed = new Discord.MessageEmbed()
                        .setFooter(`4knsfw`)
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