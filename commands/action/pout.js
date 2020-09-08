const Command = require('../../models/Command');
const Discord = require('discord.js');
const axios = require('axios');
const {error_log} = require('../../config');
const {errorMessage} = require('../../helpers/logHandler');
const ErrorEnum = require('../../helpers/errorTypes');



//remember to return before every promise
module.exports = class PoutCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'pout',
            group: 'action',
            memberName: 'pout',
            guildOnly: true,
            description: 'uWaa??',
            examples: ['~pout'],
            throttling: {
                usages: 1,
                duration: 3
            }
        });
    }

    async run(message) {
        var recipient = message.content.split(/\s+/g).slice(1).join(" ");

        await axios.get('https://rra.ram.moe/i/r?type=pout')
            .then(function(res){
                if (!recipient) {
                    var embed = new Discord.MessageEmbed()
                        .setColor('#FBCFCF')
                        .setImage(`https://rra.ram.moe${res.data.path}`);
                    return message.channel.send(`${message.author} has started pouting!`, { embed: embed });

                } else {
                    var embed = new Discord.MessageEmbed()
                        .setColor('#FBCFCF')
                        .setImage(`https://rra.ram.moe${res.data.path}`);
                    return message.channel.send(`${message.author} pouts at ${recipient}!`, { embed: embed });
                }

            })
            .catch(function(error){
                message.client.channels.cache.get(error_log).send({embed: errorMessage(error,ErrorEnum.API,message.command.name)});
            })




    }
};