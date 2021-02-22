const Command = require('../../structures/Command');
const Discord = require('discord.js');

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
                    key: 'name',
                    prompt: 'Anime Name',
                    type: 'string',
                    default: 'none',
                },
                {
                    key: 'action',
                    prompt: 'Action to take on this anime',
                    type: 'string',
                    default: 'none'
                }
            ],
        });
    }

    async run(message, { name, action } ) {

    }
};
