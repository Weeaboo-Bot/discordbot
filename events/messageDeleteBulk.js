const { MessageEmbed } = require('discord.js');

// Export message delete bulk events
module.exports = (client, messages) => {
    const message = messages.first();


    if (
        client.botLogger &&
        client.botLogger.viewable &&
        client.botLogger
            .permissionsFor(message.guild.me)
            .has(['SEND_MESSAGES', 'EMBED_LINKS'])
    ) {
        const embed = new MessageEmbed()
            .setTitle('Message Update: `Bulk Delete`')
            .setAuthor(
                `${message.guild.name}`,
                message.guild.iconURL({ dynamic: true })
            )
            .setDescription(
                `**${messages.size} messages** in ${message.channel} were deleted.`
            )
            .setTimestamp()
            .setColor(message.guild.me.displayHexColor);
        client.botLogger.send(embed);
    }
};
