const Command = require('../../structures/Command');
const Nodemon = require('nodemon');

module.exports = class ReloadBotCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'reload-bot',
            aliases: ['reload-bot', 'reloadbot'],
            group: 'util',
            memberName: 'reload-bot',
            description: 'Reloads bit.',
            details: 'Only the bot owner(s) may use this command.',
            guarded: true,
            ownerOnly: true,
        });
    }

    run(msg) {
        msg.say(`Reloading the ${msg.client.user.tag}`)
        Nodemon.restart();
    }

};
