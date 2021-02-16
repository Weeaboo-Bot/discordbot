const Command = require('../../structures/Command');
const Database = require('../../util/db');
const Storage = require('../../util/storage');
const path = require('path');
const fs = require('fs');
const storage = new Storage();
const db = new Database();


module.exports = class UpdateAssetsComand extends Command {
	constructor(client) {
		super(client, {
			name: 'update-assets',
			aliases: ['update-assets', 'update-asts'],
			group: 'util',
			memberName: 'update-assets',
			description: 'Update DB Asset List.',
			details: 'Only the bot owner(s) may use this command.',
			guarded: true,
			ownerOnly: true,
		});
	}
	
	run(msg) {
		for (const guild of this.client.guilds.cache.values()) {
			// Update roles table
			
			guild.roles.cache.forEach(role => {
				db.createDocument('roles', {
					id: role.id,
					name: role.name,
					color: role.hexColor,
					members: role.members.toJSON(),
					permissions: role.permissions.toJSON(),
					created_at: role.createdTimestamp,
				}, false);
			});
		}
		
		return msg.say('Reloaded the DB assets table and storage buckets.');
	}
};
