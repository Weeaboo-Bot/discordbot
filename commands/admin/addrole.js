const { Command } = require('discord.js-commando')

module.exports = class addRoleCommand extends Command {
    constructor(client) {
        super(client, {
            name:"addrole",
            aliases: ["add-role", "arole"],
            group: 'admin',
            memberName: 'addrole',
            description: 'Adds a role to a user.',
            args: [
                {
                    type:"user",
                    prompt:"Which user would you like to add the role to?",
                    key:"user",
                },
                {
                    type:"role",
                    prompt:"Which role would you like to add?",
                    key:"role"
                }
            ]
        })
    }
    run(msg, { user, role }) {

        msg.guild.member(user).addRole(role)
        msg.say('Successfully added ' + role + ' to ' + user)
 
    
    }
}