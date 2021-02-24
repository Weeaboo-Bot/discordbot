const Command = require('../../structures/Command');
const LogHandler = require('../../util/logHandler');
const ErrorEnum = require('../../assets/json/errorTypes.json');
const Database = require('../../util/db');
const db = new Database();

module.exports = class AddStrikeCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'addstrike',
            group: 'moderation',
            aliases: ['addstr', 'astr'],
            memberName: 'addstrike',
            description: 'Adds a strike to a member!',
            examples: ['!addstrike [name]'],
            guildOnly: true,
            clientPermissions: ['MANAGE_ROLES'],
            userPermissions: ['MANAGE_ROLES'],
            args: [
                {
                    key: 'memberName',
                    prompt: 'Please provide me a member to add the role to!',
                    type: 'string',
                },
            ],
        });
    }

    hasPermission(message) {
        return message.member.hasPermission('MANAGE_ROLES');
    }

    async run(message, { memberName  }) {
        const LOG = new LogHandler();
        const member = message.mentions.members.first();

        const docData = {
            'member_name': member.nickname,
            'strike_time': Date.now()
        };
        try {
            await db.createDocument('strikes',
                docData,false)
                .then((res) => {
                    return message.channel.send(
                        `✅ | **${member.displayName}** has been given a Strike!`
                    );
                })
                .catch((err) => {
                    message.client.channels.cache
                        .get(message.client.errorLog)
                        .send({
                            embed: LOG.errorMessage(
                                err,
                                ErrorEnum.DISCORD_API,
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
