const { MessageEmbed } = require('discord.js');

// Export message events
module.exports = async (client, message) => {
    if (message.author.bot) return undefined;

    if (message.channel.type == 'dm') {
        if (message.content.startsWith(message.client.prefix)) return;
        const channel = client.channels.cache.get(client.dmLog);

        const embed = new MessageEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setDescription(message.content)
            .setColor('#D48AD8')
            .setTimestamp();
        return channel.send({ embed });
    }

    //  if (!message.channel.(client.user.id).has('SEND_MESSAGES')) return
    //  undefined;

    if (message.content.toUpperCase().includes('PRESS F')) {
        await message.react('🇫');
        return null;
    }

    if (message.content.toUpperCase().includes('NYA')) {
        await message.react('🐱');
        return null;
    }

    if (message.content.toUpperCase().includes('BAKA')) {
        await message.react('💢');
        return null;
    }

    const hasText = Boolean(message.content);
    const hasImage = message.attachments.size !== 0;
    const hasEmbed = message.embeds.length !== 0;
    if (message.author.bot || (!hasText && !hasImage && !hasEmbed)) return;
    return null;
};
