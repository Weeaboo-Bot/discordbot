const { Command } = require('discord.js-commando');


module.exports = class UnMuteCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'unmute',
            aliases: ['undeafen', 'speakup'],
            group: 'moderation',
            memberName: 'unmute',
            guildOnly: true,
            clientPermissions: ['MANAGE_CHANNELS', 'MANAGE_MESSAGES'],
            userPermissions: ['MANAGE_CHANNELS', 'MANAGE_MESSAGES'],
            description: 'Unmutes the given user in this channel!',
            examples: ['!unmute [user]'],
            throttling: {
                usages: 1,
                duration: 15
            },
            args: [{
                key: 'memberName',
                prompt: 'Please provide me a user to unmute!',
                type: 'member'
            }]
        });
    }

    async run(message, {memberName}) {
        const member = message.mentions.members.first();

        if (member.id === this.client.user.id) return message.channel.send('Please don\'t mute me...!');
        if (member.id === message.author.id) return message.channel.send('I wouldn\'t dare mute you...!');
        if (member.roles.highest.position > message.member.roles.highest.position - 1) return message.channel.send(`❎ | You can't mute **${member.user.username}**! Their position is higher than you!`);
        if (!member.manageable) return message.channel.send(`❎ | I can't mute **${member.user.username}**! Their role is higher than mine!`);

        await message.channel.send(`Are you sure you want to unmute **${member.user.tag}** in **${message.guild.channels.cache.find(channel => channel.id === message.channel.id).name}**? \`\`(y/n)\`\``);
        const msgs = await message.channel.awaitMessages(res => res.author.id === message.author.id, {
            max: 1,
            time: 30000
        });
        if (!msgs.size || !['y', 'yes'].includes(msgs.first().content.toLowerCase())) return message.channel.send('Cancelled command!');
        if (['n', 'no'].includes(msgs.first().content.toLowerCase())) return message.channel.send('Cancelled command!');

        try {
            await message.guild.channels.cache.get(message.channel.id).overwritePermissions([{
                id: member.id,
                allow: ['SEND_MESSAGES','ADD_REACTIONS']
            }], {
                SEND_MESSAGES: true,
                ADD_REACTIONS: true
            })
        } catch (err) {
            await message.channel.send(`❎ | **${message.author.username}**, there was an error trying to unmute **${member}**! \`${err}\``);
        }

        return await message.channel.send(`**${message.author.username}**, successfully unmuted ${member.user.tag} in **${message.guild.channels.cache.find(channel => channel.id === message.channel.id).name}**! 🙊`);

    }
};