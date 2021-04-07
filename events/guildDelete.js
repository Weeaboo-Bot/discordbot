const { MessageEmbed } = require('discord.js');

// Export guild delete events
module.exports = async (client, guild) => {
    const online = guild.members.cache.filter(
        (m) => m.user.presence.status === 'online'
    ).size;
    const bots = guild.members.cache.filter((m) => m.user.bot).size;

    const textChannels = guild.channels.cache.filter((c) => c.type === 'text');
    const voiceChannels = guild.channels.cache.filter(
        (c) => c.type === 'voice'
    );

    const embed = new MessageEmbed()
        .setAuthor('Removed from a Server!', guild.iconURL())
        .setColor('#898276')
        .setThumbnail(guild.iconURL())
        .setDescription(`Server infomation for **${guild.name}**`)
        .addField(
            '❯\u2000Information',
            `•\u2000\**ID:** ${guild.id}\n\u2000\**${
                guild.owner ? 'Owner' : 'Owner ID'
            }:** ${
                guild.owner
                    ? `${guild.owner.user.tag} (${guild.owner.id})`
                    : guild.ownerID
            }\n\u2000\**Created:** ${moment(guild.createdAt).format(
                'MMMM Do YYYY'
            )} \`(${fromNow(guild.createdAt)})\`\n\u2000\**Region:** ${
                guild.region
            }\n\u2000\**Verification:** ${
                verificationLevels[guild.verificationLevel]
            }\n\u2000\**Content Filter:** ${
                explicitContentFilters[guild.explicitContentFilter]
            }`
        )
        .addField(
            '❯\u2000Quantitative Statistics',
            `•\u2000\**Channels** [${guild.channels.cache.size}]: ${textChannels.size} text - ${voiceChannels.size} voice\n\u2000\**Members** [${guild.memberCount}]: ${online} online - ${bots} bots\n\u2000\**Roles:** ${guild.roles.size}`,
            true
        )
        .addField(
            '❯\u2000Miscellaneous',
            `•\u2000\**Emojis:** ${guild.emojis.size}`,
            true
        )
        .setTimestamp()
        .setFooter(`(${client.guilds.cache.size})`);
    return client.botLogger.send({ embed });


};
