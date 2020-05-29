const { Command } = require('discord.js-commando');

module.exports = class CreateRoleCommand extends Command{
    constructor(client) {
        super(client, {
            name: 'createrole',
            group: 'roles',
            memberName: 'createrole',
            aliases: ['rolecreate'],
            description: 'Create a new role in this server.',
            args: [
                {
                    key: 'roleName',
                    type: 'string',
                    prompt: 'What is the name for this role',

                },
                {
                    key: 'rolePerms',
                    type: 'string',
                    prompt: 'What are the perms for this role?'
                }
            ]
        });
    }
    run(message, {roleName, rolePerms}) {


    }

}