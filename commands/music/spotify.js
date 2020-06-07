const {Command} = require('discord.js-commando');
const Discord = require('discord.js');
const axios = require('axios');
const {error_log} = require('../../config');
const {errorMessage} = require('../../functions/logHandler');
const ErrorEnum = require('../../functions/errorTypes')

const {spotify_id,spotify_secret} = require('../../config');

module.exports = class SpotifyCommand extends Command{
    constructor(client) {
        super(client, {
            name: 'spotify',
            aliases: ['spotifyplay'],
            memberName: 'spotify',
            guildOnly: true,
            group: 'music',
            description: 'Play a Song on Spotify',
            args: [
                {
                    key: 'songQuery',
                    type: 'string',
                    prompt: 'Please enter a song to search for'
                }
            ]
        });


    }

     run(message, {songQuery}){


    }

}