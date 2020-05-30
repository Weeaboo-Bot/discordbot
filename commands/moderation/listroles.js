const {Command} = require('discord.js-commando');
const Discord = require('discord.js');
const {error_log } = require('../../config');
const {errorMessage} = require('../../functions/logHandler');
const ErrorEnum = require('../../functions/errorTypes');


module.exports = class ListRolesCommand extends Command{
    constructor(client) {
        super(client, {
            name: 'listroles',
            guildOnly: true,
            memberName: 'listroles',
            aliases: ['roleslist'],
            group: 'moderation',
            description: 'List all Roles in this Server'
        });

    }
    run(message){
        const rolesList = message.guild.roles.cache;
        var memberList = []
        rolesList.forEach(value => {
            value.members.forEach(member => {
                memberList.push(member.user.username)
            })
            memberList.filter((item,index) => memberList.indexOf(item) === index);
                const msg = new Discord.MessageEmbed()
                    .setTitle(value.name)
                    .addField('Role ID' ,value.id)
                    .addField('Role Color' ,value.color)
                    .addField('Role Permissions' ,value.permissions.bitfield)

                    .addField('Role Members', memberList)
                    .setColor(value.color)



                message.channel.send({embed: msg});


            });







    }


}