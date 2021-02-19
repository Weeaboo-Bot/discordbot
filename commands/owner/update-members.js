const Command = require('../../structures/Command');
const Database = require('../../util/db');
const db = new Database();


module.exports = class UpdateMembersCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'update-members',
			aliases: ['update-members', 'update-membrs'],
			group: 'util',
			memberName: 'update-members',
			description: 'Update DB Member List.',
			details: 'Only the bot owner(s) may use this command.',
			guarded: true,
			ownerOnly: true,
		});
	}

	run(msg) {
		for (const guild of this.client.guilds.cache.values()) {
			// Update users table
			guild.members.cache.forEach(member => {

				db.createDocument('members',
					{
						id: member.id,
						username: member.user.username,
						nickname: member.nickname,
						display_name: member.displayName,
						disc: member.user.discriminator,
						guild: guild.id,
						guild_name: guild.name,
						joined: member.joinedTimestamp,
						permissions : member.permissions.toJSON(),
						is_bot: member.bot ? 1 : 0,
					}, false);

			});
		}

		return msg.say('Reloaded the DB members table.');
	}
};
