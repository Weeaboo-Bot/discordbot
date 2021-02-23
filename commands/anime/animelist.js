const Command = require('../../structures/Command');
const Discord = require('discord.js');
const LogHandler = require('../../util/logHandler');
const ErrorEnum = require('../../assets/json/errorTypes.json');
const axios = require('axios');



module.exports = class AnimeListCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'animelist',
            group: 'anime',
            memberName: 'animelist',
            guildOnly: true,
            description: 'Update your MyAnimeList!',
            examples: ['!animelist <anime name> <animelist action>'],
            args: [
                {
                    key: 'username',
                    prompt: 'Anime Name',
                    type: 'string',
                    default: 'none',
                },
            ],
        });
    }
    async run(message, { username } ) {
        const LOG = new LogHandler();
        const signInLink = message.client.apiKeys.LOGIN_URL;
        const reqURL = `https://api.myanimelist.net/v2/users/${username}/animelist`;
        await axios.get(reqURL, {
            params: {
                limit: 4,
            },
            headers: {
                'Authorization' : `Bearer ${message.client.apiKeys.MAL_CLIENT_SECRET}`
            }
        })
            .then(res => {
                console.log(res);
            })
            .catch(error => {
                message.client.channels.cache.get(message.client.errorLog).send({
                    embed: LOG.errorMessage(error, ErrorEnum.API, message.command.name, reqURL),
                });
            })

    }
};
