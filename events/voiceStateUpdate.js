// Export voice state update events
module.exports = (client, oldState, newState) => {
  if (newState.member.user.bot && !newState.channelID &&
      newState.guild.musicData.songDispatcher &&
      newState.member.user.id === client.user.id) {
    newState.guild.musicData.queue.length = 0;
    newState.guild.musicData.songDispatcher.end();
  }
};
