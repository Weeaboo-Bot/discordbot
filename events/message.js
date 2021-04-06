const { MessageEmbed, WebhookClient } = require('discord.js');
const BannedWords = require('../assets/json/bannedwords.json');
const db = require('../util/db');
const DB = new db();
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

    // Log Messages on Server
    if(message) {
        if (BannedWords.some(word => message.content.toString().includes(word))) {
            message.delete().catch(e => message.client.logger.error("Couldn't delete message."));
            await message.author.send('❌ Warning: Do not swear!');
        }

        // const doc = await DB.findOne('webhooks', message.guild.id).catch(message.client.logger.error);
        // const whClient = new WebhookClient(doc.document.webhook_id,doc.document.webhook_token);
        //
        //
        // const embed = new MessageEmbed()
        //     .setAuthor(message.author.tag, message.author.displayAvatarURL())
        //     .setDescription(message.content)
        //     .addField('Channel', message.channel)
        //     .setColor('#D48AD8')
        //     .setTimestamp();
        // await whClient.send(embed )
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
