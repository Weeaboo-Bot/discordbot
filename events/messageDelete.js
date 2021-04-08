const { MessageEmbed } = require('discord.js');
const { version } = require('../package.json');
const { auditMessage } = require('../util/logHandler');

// Export message delete events
module.exports = async (client, message) => {
    // ignore direct messages
    let deletionLog;
    if (!message.guild) return;
    await message.guild
        .fetchAuditLogs({
            limit: 1,
            type: 'MESSAGE_DELETE',
        })
        .then((res) => {
            deletionLog = res.entries.first();
        });

    // Let's perform a sanity check here and make sure we got *something*
    if (!deletionLog) {
        return client.logger.info(
            `A message by ${message.author.tag} was deleted, but no relevant audit logs were found.`
        );
    }

    // We now grab the user object of the person who deleted the message
    // Let us also grab the target of this action to double check things
    const { executor, target } = deletionLog;

    // And now we can update our output with a bit more information
    // We will also run a check to make sure the log we got was for the same author's message
    if (executor.id === message.author.id) {
        const embed = auditMessage(deletionLog, 'Message Deleted');
        client.botLogger.send({ embed });
        client.logger.info(
            `A message by ${message.author.tag} was deleted by ${executor.tag}.`
        );
    } else {
        const embed = new MessageEmbed()
            .setTitle('Audit Event')
            .setColor('#727293')
            .addField('Audit Event Name', 'Message Deleted')
            .addField('Member', 'Member is Unknown')
            .addField('Delete Event', 'Member is Unknown')
            .setFooter(`v${version}`)
            .setTimestamp();
        client.botLogger.send({ embed });
        client.logger.info(
            `A message by ${message.author.tag} was deleted, but we don't know by who.`
        );
    }
};
