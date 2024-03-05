const Command = require('../../structures/Command');

module.exports = class BanCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'ban',
            group: 'moderation',
            memberName: 'ban',
            guildOnly: true,
            clientPermissions: ['BAN_MEMBERS'],
            userPermissions: ['BAN_MEMBERS'],
            description: 'Bans the given user and DMs them the reason!',
            examples: ['!ban [user] [reason]'],
            throttling: {
                usages: 1,
                duration: 15,
            },
            args: [
                {
                    key: 'memberId',
                    prompt: 'Please provide me a user to ban!',
                    type: 'string',
                },
                {
                    key: 'reason',
                    prompt:
                        "Please provide me a reason to ban this user! The reason will be DM'ed to the user!",
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

    async run(message, { memberId, reason }) {
        const member = await this.client.users.fetch(memberId);

        if (member.id === this.client.user.id) {
            return message.channel.send("Please don't ban me...!");
        }
        if (member.id === message.author.id) {
            return message.channel.send("I wouldn't dare ban you...!");
        }

        await message.channel.send(
            `Are you sure you want to ban **${member.tag}**? \`\`(y/n)\`\``
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
        ) {
            return message.channel.send('Cancelled command!');
        }
        if (['n', 'no'].includes(msgs.first().content.toLowerCase())) {
            return message.channel.send('Cancelled command!');
        }

        try {
            await member.send(
                `You were banned from ${message.guild.name} by ${message.author.tag}!\n\**Reason:** ${reason}`
            );
        } catch (err) {
            await message.channel.send(
                `❎ | **${message.author.username}**, failed to Send DM to **${member}**! \`${err}\``
            );
        }

        await message.guild.members.ban(member, {
            days: 7,
            reason: `${message.author.tag}: ${reason}`,
        });

        return await message.channel.send(
            `✅ | **${message.author.username}**, successfully banned ${member.user.tag}! 👋`
        );
    }
};
