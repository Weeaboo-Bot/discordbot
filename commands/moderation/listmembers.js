const Command = require('../../structures/Command');
const Discord = require('discord.js');

module.exports = class ListMembersCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'listmembers',
            description: 'List all members in this server',
            memberName: 'listmembers',
            aliases: ['memberslist'],
            group: 'moderation',
            guildOnly: true,
        });
    }
    run(message) {
        const membersList = message.guild.members.cache;

        membersList.forEach((member) => {
            let index = 0;
            const roleList = [];
            while (index < member.roles.cache.size) {
                roleList.push(member.roles.cache.toJSON()[index].name);
                index++;
            }

            return message.channel.send({
                embed: new Discord.MessageEmbed()
                    .setTitle(member.displayName)
                    .addField('Member Username', member.user.username)
                    .addField('Member ID', member.id)
                    .addField('Member Color', member.displayHexColor)
                    .setColor(member.displayHexColor)
                    .addField('Member Discriminator', member.user.discriminator)
                    .addField('Member Tag', member.user.tag)
                    .addField('Member Roles', roleList),
            });
        });
    }
};
