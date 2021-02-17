const Discord = require('discord.js');

function errorMessage(error, error_type, error_command) {
	return new Discord.MessageEmbed()
		.setTitle(`❎ Command: ${error_command}\nError Type: ${error_type}`)
		.setColor('RED')
		.addField('Error Message', error.message || error, true)
		.addField('Error URL', (error.url || error.path), true)
		.setTimestamp();
}

function auditMessage(auditEntry) {
	return new Discord.MessageEmbed()
		.setTitle('AUDIT EVENT')
		.setColor('Color')
		.addField('AUDIT ACTION', auditEntry.action)
		.addField('AUDIT TYPE', auditEntry.actionType)
		.addField('AUDIT SENDER', auditEntry.executor)
		.addField('AUDIT REASON', auditEntry.reason, true)
		.setTimestamp();
}

module.exports = {
	errorMessage,
	auditMessage,
};
