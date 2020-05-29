const { Command } = require('discord.js-commando');

module.exports = class CreateRoleCommand extends Command{
    constructor(client) {
        super(client, {
            name: 'createrole',
            
        });
    }

}