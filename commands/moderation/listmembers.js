const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
const {error_log } = require('../../config');
const {errorMessage} = require('../../functions/logHandler');
const ErrorEnum = require('../../functions/errorTypes');


module.exports = class ListMembersCommand extends Command{
    constructor(client) {
        super(client, {
            name: 'listmembers',
            description: 'List all members in this server',
            memberName: 'listmembers',
            aliases: ['memberslist'],
            group: 'moderation',
            guildOnly: true
        });

    }
    run(message){
        const membersList = message.guild.members.cache;
        var rolesList = []
        membersList.forEach(value => {
            value._roles.forEach(role => {
                rolesList.push(message.guild.roles.cache.find(roleNew => roleNew.id === role).name)
            })

            rolesList.filter((item,index) => rolesList.indexOf(item) === index);
            const msg = new Discord.MessageEmbed()
                .setTitle(value.user.username)
                .addField('Member ID' ,value.user.id)
                .addField('Member Roles' ,rolesList)
                .addField('Member Permissions' ,value.permissions.bitfield)

                .addField('Member Color', value.displayColor)




            message.channel.send({embed: msg});


        });
    }


}