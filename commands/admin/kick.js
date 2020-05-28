const { Command } = require('discord.js-commando')


module.exports = class kickCommand extends Command {
    constructor(client) {
        super(client, {
            name:'kick',
            group: 'admin',
            memberName: 'kick',
            userPermissions: ['KICK_MEMBERS'],
            clientPermissions: ['ADMINISTRATOR'],
            description: 'Kicks a user.',
            args: [
                {
                    type:"user",
                    prompt:"Which user would you like to kick?",
                    key:"user",
                }
            ]
        })
    }
    run(msg, { user }) {
        
        if (msg.guild.member(user).hasPermission('ADMINISTRATOR')) return msg.reply('I can not kick this user, he has higher permission than I do.')
        if (!msg.guild.me.hasPermission('KICK_MEMBERS')) return msg.reply('I need the permission `KICK_MEMBERS` for this to work.')
        
        msg.guild.member(user).kick('TEST')
        msg.say('Successfully kicked ' + user)
    }
}