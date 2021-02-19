const Command = require('../../structures/Command');
const { stripIndents } = require('common-tags');

module.exports = class SoftbanCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'softban',
            aliases: ['softb'],
            group: 'moderation',
            memberName: 'softban',
            description:
                'Kicks a user and deletes all their messages in the past 7 days!',
            guildOnly: true,
            clientPermissions: ['BAN_MEMBERS'],
            userPermissions: ['BAN_MEMBERS'],
            args: [
                {
                    key: 'memberName',
                    prompt: 'Please provide me a member to softban!',
                    type: 'member',
                },
                {
                    key: 'reason',
                    prompt: 'Please set a reason for the softban!',
                    type: 'string',
                    default: 'none',
                    validate: (reason) => {
                        if (reason.length < 140) return true;
                        return 'Reason must be under 140 characters!';
                    },
                },
            ],
        });
    }

    async run(message, { memberName, reason }) {
        const member = message.mentions.members.first();

        if (member.id === this.client.user.id)
            return message.channel.send("Please don't softban me...!");
        if (member.id === message.author.id)
            return message.channel.send("I wouldn't dare softban you...!");
        if (
            member.roles.highest.position >
            message.member.roles.highest.position - 1
        )
            return message.channel.send(
                `❎ | You can't softban **${member.user.username}**! Their position is higher than you!`
            );
        if (!member.bannable)
            return message.channel.send(
                `❎ | I can't softban **${member.user.username}**! Their role is higher than mine!`
            );

        await message.channel.send(
            `Are you sure you want to softban **${member.user.tag}** \`(y/n)?\``
        );
        const msgs = await message.channel.awaitMessages(
            (res) => res.author.id === message.author.id,
            {
                max: 1,
                time: 30000,
            }
        );

        if (
            !msgs.size ||
            !['y', 'yes'].includes(msgs.first().content.toLowerCase())
        )
            return message.channel.send('Cancelled command!');

        try {
            await member.send(
                `You were softbanned from **${message.guild.name}** by **${message.author.tag}**!\n\**Reason:** ${reason}`
            );
        } catch (err) {
            await message.channel.send(
                `❎ | **${message.author.username}**, failed to Send DM **${member}** the reason! \`${err}\``
            );
        }

        await member.ban({
            days: 7,
            reason: `${message.author.tag}: ${reason} (Softban) (7 Days)`,
        });

        await message.guild.members.unban(member.user, 'Softban');
        return message.channel.send(
            `Successfully sofbanned **${member.user.tag}**! 👋`
        );
    }
};
