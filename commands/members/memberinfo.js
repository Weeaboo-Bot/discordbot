const { Command } = require('discord.js-commando')


module.exports = class MemberInfoCommand extends Command{
    constructor(client) {
        super(client, {
            name: 'memberinfo',
            group: 'members',
            memberName: 'memberinfo',
            aliases: ['member'],
            description: 'Return Information about a Member.',
            args: [
                {
                    key: 'memberName',
                    type: 'string',
                    prompt: 'Enter the member discriminator'
                }
            ]
        });
    }
    run(message, {memberName}){
        const member = message.guild.member(memberName);

        message.say(member);
    }


}