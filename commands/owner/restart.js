const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
const {error_log } = require('../../config');
const {errorMessage} = require('../../functions/logHandler');
const ErrorEnum = require('../../functions/errorTypes');
const nodemon = require('nodemon');
const util = require("util");
const child_process = require("child_process");
const exec = util.promisify(child_process.exec);


module.exports = class RestartCommand extends Command{
    constructor(client) {
        super(client, {
            name: 'restart',
            memberName: 'restart',
            group: 'owner',
            guildOnly: true,
            description: 'Restart the Discord Bot and NodeJS Process'

        });
    }
    hasPermission(msg) {
        return this.client.isOwner(msg.author);
    }
    run(message){

        message.channel.send('ARE YOU SURE YOU WANT TO REBOOT? YES/NO')
        message.channel.awaitMessages(function(msg) {
                return (msg.content === 'YES' || msg.content === 'NO')
            },
            {
                max: 1,
                time: 60000,
                errors: ['time']
            })
                .then(collected => {

                    message.guild.channels.cache.get('715437135213363271').send('@everyone **Discord Bot is Rebooting!!** Please wait 5 minutes to send commands').then(function (res) {
                        child_process.spawn()
                    })

                })
                .catch(collected => {
                    message.channel.send('Command Cancelled!');
                })


    }

}