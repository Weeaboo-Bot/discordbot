const Command = require('../../structures/Command');

module.exports = class ReloadCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'reload',
            aliases: ['reload-command', 'reload-cmd'],
            group: 'util',
            memberName: 'reload',
            description: 'Reloads a command.',
            details: 'Only the bot owner(s) may use this command.',
            guarded: true,
            ownerOnly: true,
            args: [
                {
                    key: 'command',
                    label: 'command',
                    prompt: 'Which command would you like to reload?',
                    type: 'command',
                },
            ],
        });
    }

    run(msg, { command }) {
        command.reload();
        return msg.say(`Reloaded the \`${command.name}\` command.`);
    }
};
