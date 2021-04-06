const Command = require('../../structures/Command');

module.exports = class DeleteRoleCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'delrole',
            group: 'moderation',
            aliases: ['rmrole', 'deleterole', 'remrole', 'drole', 'dr'],
            memberName: 'delrole',
            clientPermissions: ['MANAGE_ROLES'],
            userPermissions: ['MANAGE_ROLES'],
            description: 'Removed a role from a member!',
            examples: ['!delrole [name] [role]'],
            guildOnly: true,
            args: [
                {
                    key: 'memberName',
                    prompt:
                        'Please provide me a member to remove the role from!',
                    type: 'string',
                },
                {
                    key: 'roleName',
                    prompt: 'Please provide me a role to remove!',
                    type: 'string',
                },
            ],
        });
    }

    async run(message, { memberName, roleName }) {
        const role = message.guild.roles.cache.find(
            (role) => role.name === roleName
        );
        if (!message.mentions.members.first().guild.roles.cache.get(role.id)) {
            return message.channel.send(
                `❎ | **${
                    message.mentions.members.first().displayName
                }** does not have have the role **${role.name}**!`
            );
        }

        await message.mentions.members
            .first()
            .roles.remove(role)
            .then(function (res) {
                return message.channel.send(
                    `✅ | **${
                        message.mentions.members.first().displayName
                    }** has lost the role **${role.name}**!`
                );
            })
            .catch(function (err) {
                message.client.channels.cache
                    .get(message.client.errorLog)
                    .send({
                        embed: message.client.errorMessage(
                            err,
                            message.client.errorTypes.DISCORD_API,
                            message.command.name
                        ),
                    });
                return message.channel.send(
                    `❎ | **${
                        message.mentions.members.first().displayName
                    }** does not have the ${role.name} role!`
                );
            });
    }
};
