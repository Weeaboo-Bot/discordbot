const { Command } = require('discord.js-commando');

module.exports = class ListMembersCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'listmembers',
            description: 'Return a List of all Members in this Server.',
            aliases: ['members', 'listmember'],
            memberName: 'listmembers',
            group: 'members',
            
            
        });
    }
    run(message){
        const memberList = message.guild.members.fetch();

        return message.say(`Here is a List of All Members: ${memberList}`)
    }
}