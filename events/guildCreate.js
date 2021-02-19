const Database = require('../util/db');
const { MessageEmbed } = require('discord.js');
const { formatNumber } = require('../util/Util');
const db = new Database();

// Export guild create events
module.exports = async (client, guild) => {
    if (
        guild.systemChannel &&
        guild.systemChannel.permissionsFor(client.user).has('SEND_MESSAGES')
    ) {
        try {
            const channel = client.channels.cache.get(client.joinLeaveLog);

            const online = guild.members.cache.filter(
                (m) => m.user.presence.status === 'online'
            ).size;
            const bots = guild.members.cache.filter((m) => m.user.bot).size;

            const textChannels = guild.channels.cache.filter(
                (c) => c.type === 'text'
            );
            const voiceChannels = guild.channels.cache.filter(
                (c) => c.type === 'voice'
            );

            const embed = new MessageEmbed()
                .setAuthor(`Added to ${guild.name}!`, guild.iconURL())
                .setDescription(`Server infomation for **${guild.name}**`)
                .setColor('#78AEE8')
                .setThumbnail(guild.iconURL())
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
                    `•\u2000\**Channels** [${guild.channels.cache.size}]: ${textChannels.size} text - ${voiceChannels.size} voice\n\u2000\**Members** [${guild.memberCount}]: ${online} online - ${bots} bots\n\u2000\**Roles:** ${guild.roles.cache.size}`,
                    true
                )
                .addField(
                    '❯\u2000Miscellaneous',
                    `•\u2000\**Emojis:** ${guild.emojis.cache.size}`,
                    true
                )
                .setTimestamp()
                .setFooter(`(${client.guilds.cache.size})`);
            channel.send({ embed });

            const usage = client.registry.commands.get('help').usage();
            await guild.systemChannel.send(
                `Hi! I'm Weaboo, use ${usage} to see my commands, yes?`
            );

            // Add users table
            guild.members.cache.forEach((member) => {
                db.createDocument('users', {
                    id: member.id,
                    username: member.user.username,
                    disc: member.user.discriminator,
                    guild: guild.id,
                    guild_name: guild.name,
                    joined: member.joinedAt,
                    isBot: member.bot ? 1 : 0,
                });
            });
        } catch {
            // Nothing!
        }
    }
    const joinLeaveChannel = await client.fetchJoinLeaveChannel();
    if (joinLeaveChannel) {
        if (!guild.members.cache.has(guild.ownerID))
            await guild.members.fetch(guild.ownerID);
        const embed = new MessageEmbed()
            .setColor(0x7cfc00)
            .setThumbnail(guild.iconURL({ format: 'png' }))
            .setTitle(`Joined ${guild.name}!`)
            .setFooter(`ID: ${guild.id}`)
            .setTimestamp()
            .addField('❯ Members', formatNumber(guild.memberCount))
            .addField('❯ Owner', guild.owner.user.tag);
        await joinLeaveChannel.send({ embed });
    }
};
