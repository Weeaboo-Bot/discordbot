const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const {
    util: { permissions },
} = require('discord.js-commando');
const { stripIndents } = require('common-tags');

module.exports = class HelpCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'newhe',
            aliases: ['newhelp'],
            group: 'util',
            memberName: 'newhe',
            description:
                'Displays a list of available commands, or detailed information for a specific command.',
            guarded: true,
            args: [
                {
                    key: 'command',
                    prompt:
                        'Which command would you like to view the help for?',
                    type: 'command',
                    default: '',
                },
            ],
        });
    }

    async run(msg, { command }) {
        
        msg.client.api.applications(msg.client.appId).guilds(msg.client.guildId).commands.post({data: {
            name: 'ping',
            description: 'ping pong!'
        }})
    }
};
