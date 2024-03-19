const { AuditLogEvent, Events } = require('discord.js');

module.exports = async (client, auditLog) => {
    	// Define your variables.
	// The extra information here will be the channel.
	const { action, extra: channel, executorId, targetId } = auditLog;

	// Check only for deleted messages.
	if (action !== AuditLogEvent.MessageDelete) return;

	// Ensure the executor is cached.
	const executor = await client.users.fetch(executorId);

	// Ensure the author whose message was deleted is cached.
	const target = await client.users.fetch(targetId);

	// Log the output.
    client.logger.log(`A message by ${target.tag} was deleted by ${executor.tag} in ${channel}.`);
};