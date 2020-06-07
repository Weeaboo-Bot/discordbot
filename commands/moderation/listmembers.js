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


        membersList.forEach(member => {
            var index = 0;
            var roleList = [];
            while(index < member.roles.cache.size) {
                roleList.push(member.roles.cache.toJSON()[index].name);
                index++;
            }



            return message.channel.send({
                embed: new Discord.MessageEmbed()
                    .setTitle(member.displayName)
                    .addField('Member Username',member.user.username)
                    .addField('Member ID', member.id)
                    .addField('Member Color', member.displayHexColor)
                    .setColor(member.displayHexColor)
                    .addField('Member Discriminator',member.user.discriminator)
                    .addField('Member Tag',member.user.tag)
                    .addField('Member Roles', roleList)
            })



        })









    }


};