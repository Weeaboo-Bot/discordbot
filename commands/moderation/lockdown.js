const Command = require('../../structures/Command');

module.exports = class LockdownCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'lockdown',
            aliases: ['lock', 'ld'],
            group: 'moderation',
            memberName: 'lockdown',
            description: 'Prevents users from posting in the current channel!',
            details:
                'Use `lockdown start` and `lockdown stop` to start and stop a lockdown respectively!',
            guildOnly: true,
            clientPermissions: ['MANAGE_CHANNELS'],
            userPermissions: ['ADMINISTRATOR'],
            examples: ['!lockdown [start/stop]'],
            args: [
                {
                    key: 'type',
                    prompt: 'Please enter either start or stop.',
                    type: 'string',
                    default: 'start',
                    validate: (type) => {
                        if (['start', 'stop'].includes(type.toLowerCase())) {
                            return true;
                        }
                        return 'Please enter either start or stop.';
                    },
                    parse: (type) => type.toLowerCase(),
                },
                {
                    key: 'role',
                    prompt: 'Please enter the name of the role to be locked down.',
                    type: 'string',
                    default: '@everyone',
                    validate: (role) => {
                        if (
                            message.guild.roles.cache.find(
                                (role) => role.name === role
                            )
                        ) {
                            return true;
                        }
                        return 'Please enter the name of the role to be locked down.';
                    },
                    parse: (role) => role,
                },
            ],
        });
    }

    async run(message, { type, role }) {
        // eslint-disable-line consistent-return

        if (type === 'start') {
            await message.guild.channels.cache
                .get(message.channel.id)
                .overwritePermissions(
                    [
                        {
                            id: message.guild.roles.cache.find(
                                (role) => role.name === `${role}`
                            ),
                            deny: ['SEND_MESSAGES'],
                        },
                    ],
                    `Lockdown started by ${message.author.tag}`
                );
            return message.channel.send(
                `Lockdown has initiated! ${
                    message.guild.roles.cache.find(
                        (role) => role.name === `${role}`
                    ).name
                } are now unable to send a message in this channel!\n\Please use \`lockdown stop\` to end the lockdown!`
            );
        } else if (type === 'stop') {
            await message.guild.channels.cache
                .get(message.channel.id)
                .overwritePermissions(
                    [
                        {
                            id: message.guild.roles.cache.find(
                                (role) => role.name === `${role}`
                            ).id,
                            allow: ['SEND_MESSAGES'],
                        },
                    ],
                    `Lockdown ended by ${message.author.tag}`
                );

            return message.channel.send('Lockdown ended!');
        }
    }
};
