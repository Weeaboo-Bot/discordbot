const Discord = require('discord');
const axios = require('axios');
const { Command } = require('discord.js-commando');
const {error_log} = require('../../config');
const {errorMessage} = require('../../functions/logHandler');
const ErrorEnum = require('../../functions/errorTypes');

module.exports = class VSCodeCommand extends Command {
    constructor(client) {
        super(client) {
            name: 'vscode',
            memberName: 'vscode',
            aliases: ['live-share'],
            group: 'utility',
            description: 'Set/\'s up a VSCode Live Share session'
        });
    }

    async run(message){
        
    }

}