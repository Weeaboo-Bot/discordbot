const Command = require('../../structures/Command');

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
            args: [
                {
                    key: 'memberName',
                    prompt: 'Please provide me a member to add the role to!',
                    type: 'string',
                },
                {
                    key: 'roleName',
                    prompt: 'Please provide me a role to add!',
                    type: 'string',
                },
            ],
        });
    }

    hasPermission(message) {
        return message.member.hasPermission('MANAGE_ROLES');
    }

    async run(message, { memberName, roleName }) {
        const member = message.mentions.members.first();
        const role = message.guild.roles.cache.find(
            (role) => role.name === roleName
        );
        if (member.guild.roles.cache.get(role.id)) {
            return message.channel.send(
                `❎ | **${member.displayName}** already has the role **${role.name}**!`
            );
        }

        try {
            await member.roles
                .add(role)
                .then((roleRes) => {
                    return message.channel.send(
                        `✅ | **${member.displayName}** has been given the role **${role.name}**!`
                    );
                })
                .catch((err) => {
                    message.client.botLogger
                        .send({
                            embed: message.client.errorMessage(
                                err,
                                message.client.errorTypes.DISCORD_API,
                                message.command.name
                            ),
                        });
                });
        } catch (err) {
            return message.channel.send(
                `❎ | **${member.displayName}** already has the role **${role.name}**!`
            );
        }
    }
};
