const { Command } = require('discord.js-commando')

module.exports = class removeRoleCommand extends Command {
    constructor(client) {
        super(client, {
            name:"removerole",
            aliases: ["remove-role", "rrole"],
            group: 'roles',
            memberName: 'removerole',
            description: 'Removes a role from a user.',
            args: [
                {
                    type:"user",
                    prompt:"Which user would you like to remove the role from?",
                    key:"user",
                },
                {
                    type:"role",
                    prompt:"Which role would you like to remove?",
                    key:"role"
                }
            ]
        })
    }
    run(msg, { user, role }) {

        msg.guild.member(user).removeRole(role)
        msg.say('Successfully removes ' + role + ' from ' + user)
 
    
    }
}