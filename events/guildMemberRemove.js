// Export guild member remove events
module.exports = async (client, member) => {
    client.logger.info(
        `${member.guild.name}: ${member.user.tag} has left the server`
    );
    if (member.id === client.user.id) return null;
    if (member.partial) await member.fetch();
    if (client.botLogger.topic && client.botLogger.topic.includes('<weaboo:disable-leave>')) {
        return null;
    }
    try {
        const leaveMessage =
            client.leaveMessages[
                Math.floor(Math.random() * client.leaveMessages.length)
            ];
        await client.botLogger.send(
            leaveMessage.replaceAll('{{user}}', `**${member.user.tag}**`)
        );
        return null;
    } catch {
        return null;
    }
};
