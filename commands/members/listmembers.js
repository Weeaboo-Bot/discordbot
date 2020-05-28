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

    async run(message) {

        const members = message.guild.members;
        //JSON Array of all the members
        const memberList = members.cache;


        var msg = ""
        for (var key in memberList) {


            msg = `${ memberList.entries().next().value[1].user.username} : ${ memberList.values().next().value[1].user.discriminator}\n`




        }

        message.say("hi")
    }
}