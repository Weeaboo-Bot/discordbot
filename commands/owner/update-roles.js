const Command = require('../../structures/Command');
const Database = require('../../util/db');
const db = new Database();

module.exports = class UpdateRolesComand extends Command {
    constructor(client) {
        super(client, {
            name: 'update-roles',
            aliases: ['update-roles', 'update-rls'],
            group: 'util',
            memberName: 'update-roles',
            description: 'Update DB Role List.',
            details: 'Only the bot owner(s) may use this command.',
            guarded: true,
            ownerOnly: true,
        });
    }

    run(msg) {
        for (const guild of this.client.guilds.cache.values()) {
            // Update roles table
            guild.roles.cache.forEach((role) => {
                db.createDocument(
                    'roles',
                    {
                        id: role.id,
                        name: role.name,
                        color: role.hexColor,
                        members: role.members.toJSON(),
                        permissions: role.permissions.toJSON(),
                        created_at: role.createdTimestamp,
                    },
                    false
                );
            });
        }

        return msg.say('Reloaded the DB roles table.');
    }
};
