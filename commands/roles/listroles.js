const { Command } = require('discord.js-commando');



module.exports = class ListRolesCommand extends Command{
    constructor(client) {
        super(client, {
            name: 'listroles',
            description: 'List all the roles in this server',
            group: 'roles',
            memberName: 'listroles',
            aliases: ['listserverroles']
        });
    }
    run(message){

    }

}