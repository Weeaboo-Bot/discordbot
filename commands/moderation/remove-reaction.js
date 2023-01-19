const Command = require('../../structures/Command');
const { clearValue } = require('../../util/dbhandler');

module.exports = class RemoveReactionCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'removereaction',
            group: 'moderation',
            aliases: ['remreaction', 'removereact'],
            memberName: 'removereaction',
            description: 'Remove a reaction for a member!',
            examples: ['!removereaction [member-name]'],
            guildOnly: true,
            args: [
                {
                    key: 'member',
                    prompt: 'Please provide me a member to add the reaction to!',
                    type: 'member',
                },
            ],
        });
    }

    async run(message, { member }) {
        let memberToUse = null;

        // If the author mentions themselves
        if ((member.id === message.author.id) || (member == null)) {
            memberToUse = message.author.id;
        } 

        try {
            await clearValue(memberToUse)
                .then((reactionRes) => {
                    return message.channel.send(
                        `✅ | **${member.displayName}** has lost the reaction !`
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
                `❎ | **An Error occured removing reactions**!`
            );
        }
    }
};
