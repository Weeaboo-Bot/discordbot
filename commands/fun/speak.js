const {Command} = require('discord.js-commando');
const Discord = require('discord.js');
const axios = require('axios');
const {error_log } = require('../../config');
const {errorMessage} = require('../../functions/logHandler');
const ErrorEnum = require('../../functions/errorTypes');

module.exports = class SpeakCommand extends Command{
    constructor(client) {
        super(client, {
            name:'speak',
            memberName:'speak',
            aliases: ['bottts'],
            group:'fun',
            description: 'Make the Bot TTS',
            guildOnly: true,
            args: [
                {
                    key: 'query',
                    type: 'string',
                    prompt: 'Input some text for me to speak!'
                }
            ]
        });

    }
    run(message, {query}){



        return message.channel.send(query,{
            tts: true,
        })
    }


}