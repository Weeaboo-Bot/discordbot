const { MessageEmbed } = require('discord.js');

// Export guild member update events
module.exports = (client, oldMember, newMember) => {
    const embed = new MessageEmbed()
        .setAuthor(
            `${newMember.user.tag}`,
            newMember.user.displayAvatarURL({ dynamic: true })
        )
        .setTimestamp()
        .setColor(oldMember.guild.me.displayHexColor);

    // Nickname change
    if (oldMember.nickname != newMember.nickname) {

        if (
            client.botLogger &&
            client.botLogger.viewable &&
            client.botLogger
                .permissionsFor(oldMember.guild.me)
                .has(['SEND_MESSAGES', 'EMBED_LINKS'])
        ) {
            const oldNickname = oldMember.nickname || '`None`';
            const newNickname = newMember.nickname || '`None`';
            embed
                .setTitle('Member Update: `Nickname`')
                .setDescription(`${newMember}'s **nickname** was changed.`)
                .addField('Nickname', `${oldNickname} ➔ ${newNickname}`);
            client.botLogger.send(embed);
        }
    }

    // Role add
    if (oldMember.roles.cache.size < newMember.roles.cache.size) {
        if (
            client.botLogger &&
            client.botLogger.viewable &&
            client.botLogger
                .permissionsFor(oldMember.guild.me)
                .has(['SEND_MESSAGES', 'EMBED_LINKS'])
        ) {
            const role = newMember.roles.cache
                .difference(oldMember.roles.cache)
                .first();
            embed
                .setTitle('Member Update: `Role Add`')
                .setDescription(`${newMember} was **given** the ${role} role.`);
            client.botLogger.send(embed);
        }
    }

    // Role remove
    if (oldMember.roles.cache.size > newMember.roles.cache.size) {
        if (
            client.botLogger &&
            client.botLogger.viewable &&
            client.botLogger
                .permissionsFor(oldMember.guild.me)
                .has(['SEND_MESSAGES', 'EMBED_LINKS'])
        ) {
            const role = oldMember.roles.cache
                .difference(newMember.roles.cache)
                .first();
            embed
                .setTitle('Member Update: `Role Remove`')
                .setDescription(
                    `${newMember} was **removed** from ${role} role.`
                );
            client.botLogger.send(embed);
        }
    }
};
