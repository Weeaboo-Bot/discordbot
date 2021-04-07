// Export voice state update events
let temporary = [];
module.exports = async (client, oldMember, newMember) => {
    if (
        newMember.member.user.bot &&
        !newMember.channelID &&
        newMember.guild.musicData.songDispatcher &&
        newMember.member.user.id === client.user.id
    ) {
        newMember.guild.musicData.queue.length = 0;
        newMember.guild.musicData.songDispatcher.end();
    }
};


