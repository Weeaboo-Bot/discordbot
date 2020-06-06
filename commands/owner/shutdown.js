const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
const {error_log } = require('../../config');
const {errorMessage} = require('../../functions/logHandler');
const ErrorEnum = require('../../functions/errorTypes');


module.exports = class ShutDownCommand extends Command{
    constructor(client) {
        super(client, {
            name: 'shutdown',
            memberName: 'shutdown',
            description: 'Shutdown the Bot and End NodeJS Program',
            group: 'owner',
            guildOnly: true
        });
    }
    hasPermission(msg) {
        return this.client.isOwner(msg.author);
    }
    run(message){


        message.channel.send('ARE YOU SURE YOU WANT TO SHUTDOWN? YES/NO')
        message.channel.awaitMessages(function(msg) {
                return (msg.content === 'YES' || msg.content === 'NO')
            },
            {
                max: 1,
                time: 60000,
                errors: ['time']
            })
            .then(collected => {
               collected.each(res => {
                   if(res.content === 'YES'){
                       message.guild.channels.cache.get('715437135213363271').send('Discord Bot is **Offline**').then(function (res) {
                            process.exit(0)
                           console.log("Program Ended");
                       })
                   }
               })



                // message.guild.channels.cache.get('715437135213363271').send('@everyone **Discord Bot is Rebooting!!** Please wait 5 minutes to send commands').then(function (res) {
                //     child_process.spawn()
                // })

            })



    }

}