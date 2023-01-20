const Command = require('../../structures/Command');
const { setValue, getValue } = require('../../util/dbhandler');

module.exports = class AddReactionCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'addreaction',
            group: 'moderation',
            aliases: ['newreaction', 'addreact'],
            memberName: 'addreaction',
            description: 'Adds a reaction to a member!',
            examples: ['!addreaction [emoji-name]'],
            guildOnly: true,
            args: [
                {
                    key: 'member',
                    prompt: 'Please provide me a member to add the reaction to!',
                    type: 'member',
                },
                {
                    key: 'reactionName',
                    prompt: 'Please provide me a reaction to add!',
                    type: 'string',
                    default: 'smile'
                },
            ],
        });
    }

    async run(message, { member, reactionName }) {
        let memberToUse = null;

        // If the author mentions themselves
        if ((member.id === message.author.id) || (member == null)) {
            memberToUse = message.author.id;
        } else {
            memberToUse = member.id;
        }

        try {
            await setValue(memberToUse, reactionName, 'user-reactions')
                .then((reactionRes) => {
                    return message.channel.send(
                        `✅ | **${member.displayName}** has been given the reaction **${reactionName}**!`
                    );
                })
                .catch((err) => {
                    message.client.botLogger({
                        embed: message.client.errorMessage(
                            err,
                            message.client.errorTypes.DISCORD_API,
                            message.command.name
                        ),
                    });
                });
        } catch (err) {
            return message.channel.send(
                `❎ | **An Error occured adding reactions**!`
            );
        }
    }
};
