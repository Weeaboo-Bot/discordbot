const Discord = require('discord.js');
const { v4: uuidv4 } = require('uuid');

// Weaboo Bot Log Handler
// Call these functions from within Commands - Will log to the Webhook Log Channel


function dmMessage(dm) {
    return new Discord.MessageEmbed()
        .setAuthor(dm.author.tag, dm.author.displayAvatarURL())
        .setDescription(dm.content)
        .setColor('#D48AD8')
        .setTimestamp();
}

function newMessage(logger, message) {
    logger.info(message);
    return new Discord.MessageEmbed()
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setDescription(message.content)
        .addField('Channel', message.channel)
        .setColor('#D48AD8')
        .setTimestamp();
}

function errorMessage(logger, error, error_type, error_command) {
    const logId = uuidv4();
    logger.error(`${logId} ${error}`);
    return new Discord.MessageEmbed()
        .setTitle(`❎ Command: ${error_command}\nError Type: ${error_type}`)
        .setColor('RED')
        .addField('Error ID', logId, true)
        .addField('Error Name', error.name || 'Unknown Error', true)
        .addField('Error Message', error.message || error , true)
        .addField('Error URL', error.url || error.path, true)
        .setTimestamp();
}

function statusMessage(logger, status, status_type, status_details) {
    logger.info(`${status_type} - ${status} - ${status_details}`);
    return new Discord.MessageEmbed()
        .setTitle(`✅ Status: ${status}\n Status Type: ${status_type}`)
        .setColor('GREEN')
        .addField('Status Details', status_details , true)
        .setTimestamp();
}

function auditMessage(logger, auditEntry, reason, message) {
    logger.info(`${JSON.stringify(auditEntry)} - ${reason} - ${message}`);
    return new Discord.MessageEmbed()
        .setTitle('AUDIT EVENT')
        .setColor('BLUE')
        .addField('AUDIT ACTION', auditEntry.action)
        .addField('AUDIT TYPE', auditEntry.actionType)
        .addField('AUDIT SENDER', auditEntry.executor)
        .addField('AUDIT TARGET', auditEntry.target)
        .addField('AUDIT CHANNEL', auditEntry.extra.channel.name)
        .addField('AUDIT GUILD', auditEntry.extra.channel.guild)
        .addField('AUDIT MESSAGE', message)
        .addField('AUDIT REASON', auditEntry.reason || reason, true)
        .setTimestamp();
}

function roleMessage(logger, roleEntry, reason) {
    logger.info(`${JSON.stringify(roleEntry)} - ${reason}`);
    return new Discord.MessageEmbed()
        .setTitle('Role Event')
        .setColor('GREEN')
        .addField('Role Name',roleEntry.name)
        .addField('Member Name', roleEntry.member.nickname)
        .addField('Role Action', roleEntry.action)
        .addField('Role Type', roleEntry.type)
        .addField('Role Change Reason', reason)
        .setTimestamp();
}

function guildMessage(logger, guildEntry, reason) {
    logger.info(`${JSON.stringify(guildEntry)} - ${reason}`)
    return new Discord.MessageEmbed()
        .setTitle('Guild Event')
        .setColor('GOLD')
        .addField('Guild Name',guildEntry.name)
        .addField('Guild Action', guildEntry.action)
        .addField('Guild Type', guildEntry.type)
        .addField('Guild Change Reason', reason)
        .setTimestamp();
}

function readyMessage(readyEntry) {
    readyEntry.client.logger.info(`${JSON.stringify(readyEntry)}`);
    return new Discord.MessageEmbed()
        .setAuthor(
            `${readyEntry.client.user.tag} has (re)started!`,
            readyEntry.client.user.displayAvatarURL({ format: 'png' })
        )
        .setColor('#727293')
        .setDescription(
            `•\u2000\Serving ${readyEntry.client.users.cache.size} users in ${readyEntry.client.guilds.cache.size} servers and ${readyEntry.client.channels.cache.size} channels!\n\u2000**Commands:** ${readyEntry.client.registry.commands.size}`
        )
        .setFooter(`v${readyEntry.version}`)
        .setTimestamp();
}

module.exports = {
    dmMessage,
    newMessage,
    errorMessage,
    auditMessage,
    roleMessage,
    guildMessage,
    readyMessage,
    statusMessage,
};
