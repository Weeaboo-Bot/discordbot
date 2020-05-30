const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
const {error_log } = require('../../config');
const {errorMessage} = require('../../functions/logHandler');
const ErrorEnum = require('../../functions/errorTypes');

module.exports = class AddRoleCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'addrole',
            group: 'moderation',
            aliases: ['newrole', 'ar', 'addr', 'assign'],
            memberName: 'addrole',
            description: 'Adds a role to a member!',
            examples: ['!addrole [name] [role]'],
            guildOnly: true,
            clientPermissions: ['MANAGE_ROLES'],
            userPermissions: ['MANAGE_ROLES'],
            args: [{
                key: 'memberName',
                prompt: 'Please provide me a member to add the role to!',
                type: 'string'
            },
                {
                    key: 'roleName',
                    prompt: 'Please provide me a role to add!',
                    type: 'string'
                }
            ]
        });
    }




    async run(message, {memberName, roleName}) {


        const role = message.guild.roles.cache.find(role => role.name === roleName);
        if (message.mentions.members.first().roles.cache.get(role.id)) return message.channel.send(`❎ | **${message.mentions.members.first().displayName}** already has the role **${role.name}**!`)



            await message.mentions.members.first().roles.add(role)
                .then(function(res){
                    return message.channel.send(`✅ | **${message.mentions.members.first().displayName}** has gained the role **${role.name}**!`)
                })
                .catch(function(err){

                    message.client.channels.cache.get(error_log).send({embed: errorMessage(err,ErrorEnum.DISCORD_API,message.command.name)});
                    return message.channel.send(`❎ | **${message.mentions.members.first().displayName}** does not have the ${role.name} role!`)
                })







    };
};