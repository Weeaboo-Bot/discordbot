const { Permissions } = require('discord.js');
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
                    key: 'member',
                    prompt: 'Please provide me a user to ban!',
                    type: 'member',
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

    async run(message, { member, reason }) {

        const cannotBan = (message, member, reason) => {
            // Check protected users
            const protectedIds = [this.client.user.id, message.author.id, message.guild.ownerID, message.client.ownerId];
            if (protectedIds.includes(member.id)) {
                return message.channel.send(reason); // Use specified reason for conciseness
            }

            // Check role hierarchy
            if (member.roles.highest.position > message.member.roles.highest.position - 1) {
                return message.channel.send(
                    `❎ | You can\'t ban **${member.user.username}**! Their position is higher than yours!`
                );
            }

            // Check manageability
            if (!member.manageable) {
                return message.channel.send(
                    `❎ | I can\'t ban **${member.user.username}**! Their role is higher than mine!`
                );
            }

            // Check permissions
            if (!message.member.permissionsIn(message.channel).has(Permissions.FLAGS.BAN_MEMBERS)) {
                return message.channel.send("You don't have permission to ban members!");
            }

            return false; // Pass check if all conditions are met
        };

        // Usage:
        const canBan = !cannotBan(message, member, "Please don't ban me...!"); // Example reason for self-ban
        if (canBan) {
            await message.channel.send(
                `Are you sure you want to ban **${member.user.tag}**? \`\`(y/n)\`\``
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

    }
};
