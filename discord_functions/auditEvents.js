const Discord = require('discord.js');
const { audit_log } = require('../config');
const { auditMessage } = require('./logHandler');
const ErrorEnum = require('./errorTypes');
const { client } = require('../index');


function audits() {
	client.on('ready', async (guild, user) => {
		const fetchedLogs = await guild.fetchAuditLogs({
			limit: 1,
			type: logTypes,
		});
		// Since we only have 1 audit log entry in this collection, we can simply grab the first one
		const auditLogsEntry = fetchedLogs.entries.first();

		// Let's perform a sanity check here and make sure we got *something*
		if (!auditLogsEntry) {
			return console.log(
				`${user.tag} was FILL IN from ${guild.name} but no audit log could be found.`);
		}

		// We now grab the user object of the person who banned the user
		// Let us also grab the target of this action to double check things
		const { executor, target } = auditLogsEntry;

		// And now we can update our output with a bit more information
		// We will also run a check to make sure the log we got was for the same kicked member
		if (target.id === user.id) {

			console.log(
				`${user.tag} got hit with the swift hammer of justice in the guild ${guild.name}, wielded by the mighty ${executor.tag}`);
			return client.channels.cache.get(audit_log)
				.send({ embed: auditMessage(auditLogsEntry) });
		}
		else {
			console.log(
				`${user.tag} got hit with the swift hammer of justice in the guild ${guild.name}, audit log fetch was inconclusive.`);
		}
	});
}

module.exports = audits;

