const {MessageEmbed} = require('discord.js');

// Export message delete bulk events
module.exports = (client, messages) => {
  const message = messages.first();

  const messageDeleteLog = client.fetchAuditChannel();
  if (messageDeleteLog && messageDeleteLog.viewable &&
      messageDeleteLog.permissionsFor(message.guild.me).has([
        'SEND_MESSAGES', 'EMBED_LINKS'
      ])) {
    const embed = new MessageEmbed()
                      .setTitle('Message Update: `Bulk Delete`')
                      .setAuthor(`${message.guild.name}`,
                                 message.guild.iconURL({dynamic : true}))
                      .setDescription(`**${messages.size} messages** in ${
                          message.channel} were deleted.`)
                      .setTimestamp()
                      .setColor(message.guild.me.displayHexColor);
    messageDeleteLog.send(embed);
  }
};
