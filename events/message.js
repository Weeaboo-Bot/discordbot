const BannedWords = require('../assets/json/bannedwords.json');
const ConstantUsers = require('../assets/json/constant-users.json');
// Export message events
module.exports = async (client, message) => {
    const yakEmote = message.guild.emojis.cache.find((emoji) => emoji.name === 'yahkuna');
    const lumenEmote = message.guild.emojis.cache.find((emoji) => emoji.name === 'defLikeLumen');
    const nullEmote = message.guild.emojis.cache.find((emoji) => emoji.name === 'defLikeNull');
    const yak = '657980540665724938';
    const lumen = '327631148736053248';
    const armhad = '632759154200674304';
    const n_ull = '827485907182944256';

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
    }

    switch (message.author.id) {
        case yak:
            await message.react(yakEmote);
            break;
        case lumen:
            await message.react(lumenEmote);
            break;
        case armhad:
            await message.react('🍆');
            break;
        case n_ull:
            await message.react(nullEmote);
            break;
        default:
            break;
    }

    // Reply on Pinned message
    if(message.pinned) {
        await message.reply('This message has been pinned');
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
