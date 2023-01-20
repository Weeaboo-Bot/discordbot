const Command = require('../../structures/Command');
const { getValue } = require('../../util/dbhandler');

module.exports = class GetReactionCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'getreaction',
            group: 'moderation',
            aliases: ['loadreaction', 'getreact'],
            memberName: 'getreaction',
            description: 'Load a reaction for a member!',
            examples: ['!getreaction [emoji-name]'],
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
        // Check for existing reactions
        await getValue(memberToUse, 'user-reactions')
            .then((reactionRes) => {
                if (reactionRes) {
                    const reaction = message.guild.emojis.cache.findKey((emoji) => emoji.name = reactionRes.emoji);

                    if (reaction == undefined) {
                        message.client.botLogger({
                            embed: message.client.errorMessage(
                                'emoji not found in guild cache',
                                message.client.errorTypes.DISCORD_API,
                                message.command.name
                            ),
                        });

                        // Tell the user
                        return message.channel.send(
                            `❎ | **${reactionRes}** does not exist in this guild!`
                        );
                    }
          
                    return message.channel.send(
                        `✅ | **${member.displayName}** has the reaction ${reactionRes.emoji}!`
                    );
                }
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
                `❎ | **An Error occured looking up reactions**!`
            );
        }
    }
};
