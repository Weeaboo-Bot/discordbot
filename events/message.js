const BannedWords = require('../assets/json/bannedwords.json');
// Export message events
module.exports = async (client, message) => {

    if (message.author.bot) return undefined;

    if (message.channel.type == 'dm') {
        if (message.content.startsWith(message.client.prefix)) return;
        return client.channels.cache.get(client.dmLog).send({ embed : client.dmMessage(message) });
    }

    // Log Messages on Server
    if(message) {
        if (BannedWords.some(word => message.content.toString().includes(word))) {
            message.delete().catch(e => message.client.logger.error("Couldn't delete message."));
            await message.author.send('❌ Warning: Do not swear!');
        }

        const embed = client.newMessage(message);
        await client.webhook.send(embed);

        await message.react('🤖');
        return null;
    }

    if (message.author.id === '657980540665724938') {
        await message.react('😈');
        return null;
    }

    //  if (!message.channel.(client.user.id).has('SEND_MESSAGES')) return undefined;

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
