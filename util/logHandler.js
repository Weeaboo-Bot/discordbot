const Discord = require('discord.js');

module.exports = class WeabooLogHandler {

    errorMessage(error, error_type, error_command) {
        return new Discord.MessageEmbed()
            .setTitle(`❎ Command: ${error_command}\nError Type: ${error_type}`)
            .setColor('RED')
            .addField('Error Message', error.message || error, true)
            .addField('Error URL', error.url || error.path, true)
            .setTimestamp();
    }

    infoMessage(info) {
        return new Discord.MessageEmbed()
            .setTitle('INFO LOG')
            .setColor('GREEN')
            .addField('INFO', info.message)
            .addField('INFO TYPE',info.type)
            .addField('INFO COMMAND', info.command)
            .setTimestamp();
    }

    auditMessage(auditEntry) {
        return new Discord.MessageEmbed()
            .setTitle('AUDIT EVENT')
            .setColor('BLUE')
            .addField('AUDIT ACTION', auditEntry.action)
            .addField('AUDIT TYPE', auditEntry.actionType)
            .addField('AUDIT SENDER', auditEntry.executor)
            .addField('AUDIT REASON', auditEntry.reason, true)
            .setTimestamp();
    }
}
