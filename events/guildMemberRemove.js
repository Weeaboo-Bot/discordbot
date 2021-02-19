// Export guild member remove events
module.exports = async (client, member) => {
  client.logger.info(
      `${member.guild.name}: ${member.user.tag} has left the server`);
  if (member.id === client.user.id)
    return null;
  if (member.partial)
    await member.fetch();
  const channel = client.fetchJoinLeaveChannel();
  if (!channel || !channel.permissionsFor(client.user).has('SEND_MESSAGES')) {
    return null;
  }
  if (channel.topic && channel.topic.includes('<weaboo:disable-leave>')) {
    return null;
  }
  try {
    const leaveMessage = client.leaveMessages[Math.floor(
        Math.random() * client.leaveMessages.length)];
    await channel.send(
        leaveMessage.replaceAll('{{user}}', `**${member.user.tag}**`));
    return null;
  } catch {
    return null;
  }
};
