const { Command } = require('discord.js-commando');

module.exports = class NickCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'nickname',
            group: 'moderation',
            aliases: ['nick'],
            memberName: 'nickname',
            clientPermissions: ['MANAGE_NICKNAMES'],
            userPermissions: ['MANAGE_NICKNAMES'],
            description: 'Assigns a nickname to a member! Use "clear"or leave it blank to remove the nickname!',
            examples: ['!nickname [user] [name/clear]'],
            guildOnly: true,
            args: [{
                    key: 'memberName',
                    prompt: 'Please provide me a member to assign nicknames for!',
                    type: 'member'
                },
                {
                    key: 'nickname',
                    prompt: 'Please provide me a nickname to assign!',
                    default: 'clear',
                    type: 'string'
                }
            ]
        });
    }

    async run(message, {memberName,nickname}) {
        const member = message.mentions.members.first();
        if (member.id === this.client.user.id) return message.channel.send('Please don\'t nickname me...!');
        if (member.id === message.author.id) return message.channel.send('I wouldn\'t dare nickname you...!');
        if (member.roles.highest.position > message.member.roles.highest.position - 1) return message.channel.send(`❎ | You can't nickname **${member.user.username}**! Their position is higher than you!`);
        if (!member.bannable) return message.channel.send(`❎ | I can't nickname **${member.user.username}**! Their role is higher than mine!`);

        return await nickname !== 'clear' ? member.setNickname(nickname).then(() => message.say(`The nickname **${nickname}** has been assigned to **${member.user.username}**!`)) : member.setNickname('').then(() => message.say(`**${member.displayName}**'s nickname has been cleared!`));
    };
};