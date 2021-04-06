const { MessageEmbed } = require('discord.js');
const { version } = require('../package.json');
const { formatNumber } = require('../util/Util');

// Export ready events
module.exports = async (client) => {
    // Push client-related activities
    client.activities.push(
        {
            text: () => `${formatNumber(client.guilds.cache.size)} servers`,
            type: 'WATCHING',
        },
        {
            text: () =>
                `with ${formatNumber(client.registry.commands.size)} commands`,
            type: 'PLAYING',
        },
        {
            text: () => `${formatNumber(client.channels.cache.size)} channels`,
            type: 'WATCHING',
        }
    );

    // Interval to change activity every minute
    client.setInterval(() => {
        const activity =
            client.activities[
                Math.floor(Math.random() * client.activities.length)
            ];
        const text =
            typeof activity.text === 'function'
                ? activity.text()
                : activity.text;
        client.user.setActivity(text, { type: activity.type });
    }, 60000);

    client.logger.info(
        `[READY] Logged in as ${client.user.tag}! ID: ${client.user.id}`
    );
    client.logger.info(
        `${client.user.tag} is running on ${client.guilds.cache.size} server(s)`
    );

    const channel = client.channels.cache.get(client.statusLog);
    const embed = new MessageEmbed()
        .setAuthor(
            `${client.user.tag} has (re)started!`,
            client.user.displayAvatarURL({ format: 'png' })
        )
        .setColor('#727293')
        .setDescription(
            `•\u2000\Serving ${client.users.cache.size} users in ${client.guilds.cache.size} servers and ${client.channels.cache.size} channels!\n\u2000**Commands:** ${client.registry.commands.size}`
        )
        .setFooter(`v${version}`)
        .setTimestamp();
    channel.send({ embed });
};
