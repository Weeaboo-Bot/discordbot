const { Command } = require('discord.js-commando');
const path = require('path');

module.exports = class WeabooCommand extends Command {
	constructor(client, info) {
		super(client, info);
		
		this.shortDescription = info.shortDescription || null;
		this.cooldown = info.cooldown || null;
		this.dashboardsettings = info.dashboardsettings || null;
		this.clientpermissions = info.clientpermissions || [];
		this.userpermissions = info.userpermissions || [];
		this.argsSingleQuotes = info.argsSingleQuotes || false;
		this.throttling = info.unknown ? null : info.throttling || { usages: 1, duration: 2 };
		this.uses = 0;
		this.credit = info.credit || [];
		this.credit.push({
			name: 'Techie3445',
			url: 'https://github.com/sdoran35',
			reason: 'Repo',
		});
	}
};