// Export voice state update events

let channelName = 'Private VC';

const getVoiceChannels = (guild) => {
    return guild.channels.cache.filter((channel) => {
        return channel.type === 'voice' && channel.name === channelName;
    });
}

module.exports = async (client, oldMember, newMember) => {
    const joined = !!newMember.channelID;
    const { guild } = oldMember;

    const channelId = joined ? newMember.channelID : oldMember.channelID;
    let channel = guild.channels.cache.get(channelId);

    client.logger.info(`${newMember.channelID} vs ${oldMember.channelID} (${channel.name})`);

    if (channel.name === channelName) {
        if (joined) {
            const channels = getVoiceChannels(guild);

            let hasEmpty = false;

            channels.forEach((channel) => {
                if (!hasEmpty && channel.members.size === 0) {
                    hasEmpty = true;
                }
            })

            if (!hasEmpty) {
                const {
                    type,
                    userLimit,
                    bitrate,
                    parentID,
                    permissionOverwrites,
                    rawPosition,
                } = channel;

                guild.channels.create(channelName, {
                    type,
                    bitrate,
                    userLimit,
                    parent: parentID,
                    permissionOverwrites,
                    position: rawPosition,
                })
            }
        } else if (
            channel.members.size === 0 &&
            getVoiceChannels(guild).size > 1
        ) {
            channel.delete();
        }
    } else if (oldMember.channelID) {
        channel = guild.channels.cache.get(oldMember.channelID)
        if (
            channel.name === channelName &&
            channel.members.size === 0 &&
            getVoiceChannels(guild).size > 1
        ) {
            channel.delete();
        }
    }

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


