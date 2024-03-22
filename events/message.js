// Export message events
module.exports = async (client, message) => {
    if (message.author.bot) return undefined;

    if (message.channel.type == 'dm') {
        if (message.content.startsWith(message.client.prefix)) return;
        return client.channels.cache.get(client.dmLog).send({ embed: client.dmMessage(client.logger, message) });
    }

    // Reply on Pinned message
    if (message.pinned) {
        await message.reply('This message has been pinned');
        return null;
    }

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
