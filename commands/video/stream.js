const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
const axios = require('axios');
const {error_log} = require('../../config');
const {errorMessage} = require('../../functions/logHandler');
const ErrorEnum = require('../../functions/errorTypes')

module.exports = class StreamCommand extends Command{
    constructor(client) {
        super(client,{
            name: 'startstream',
            description: 'Start a Stream on Discord',
            memberName: 'startstream',
            group: 'video',
            guildOnly: true,

        });

    }


}