const Command = require('../../structures/Command');
const Database = require('../../util/db');
const db = new Database();

module.exports = class UpdateChannelsCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'update-channels',
            aliases: ['update-channels', 'update-chnls'],
            group: 'util',
            memberName: 'update-channels',
            description: 'Update DB Channel List.',
            details: 'Only the bot owner(s) may use this command.',
            guarded: true,
            ownerOnly: true,
        });
    }

    run(msg) {
        for (const guild of this.client.guilds.cache.values()) {
            // Update channels table
            guild.channels.cache.forEach((channel) => {
                db.createDocument(
                    'channels',
                    {
                        id: channel.id,
                        group: channel.parent ? channel.parent.name : 'N/A',
                        type: channel.type,
                        members: channel.members
                            ? channel.members.toJSON()
                            : 'N/A',
                        created_at: channel.createdTimestamp,
                        position: channel.position,
                        guild: channel.guild ? channel.guild.name : 'N/A',
                    },
                    false
                );
            });
        }

        return msg.say('Reloaded the DB channels table.');
    }
};
