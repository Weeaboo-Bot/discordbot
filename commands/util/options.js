const Command = require('../../structures/Command');
const { stripIndents } = require('common-tags');

module.exports = class OptionsCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'options',
			aliases: ['options-list'],
			group: 'util',
			memberName: 'options',
			description: 'Responds with a list of server options.',
			guarded: true,
		});
	}

	run(msg) {
		return msg.say(stripIndents`
			__**Server Options**__
			Place the option in the appropriate channel's topic to use.

			__General Options__
			\`<weaboo:disable-leave>\` Disables leave messages (System Channel).

			__Phone Options__
			\`<weaboo:phone>\` Allows this channel to receive phone calls.
			\`<weaboo:phone:no-voicemail>\` Prevents this channel from receiving voicemails for missed calls.
			\`<weaboo:phone:no-random>\` Makes the channel only able to be called directly, rather than picked randomly.
			\`<weaboo:phone:block:INSERTIDHERE>\` Blocks a channel or server from contacting you via phone.
			\`<weaboo:phone-book:hide>\` Hides this channel from \`phone-book\`.

			__Portal Options__
			\`<weaboo:portal>\` Marks the channel as a portal channel for \`portal-send\`.
			\`<weaboo:portal:hide-name>\` Hides the channel's name when the channel is chosen to recieve a portal message.
		`);
	}
};
