const Command = require('../../structures/Command');
const Database = require('../../util/db');
const db = new Database();

module.exports = class UpdateCommandsCommand extends Command {
  constructor(client) {
    super(client, {
      name : 'update-commands',
      aliases : [ 'update-commands', 'update-cmds' ],
      group : 'util',
      memberName : 'update-commands',
      description : 'Update DB Command List.',
      details : 'Only the bot owner(s) may use this command.',
      guarded : true,
      ownerOnly : true,
    });
  }

  run(msg) {
    // Update commands table
    this.client.registry.commands.forEach((command) => {
      db.createDocument('commands', {
        name : command.name,
        aliases : command.aliases,
        examples : command.examples,
        group : command.group.name,
        desc : command.description,
        client_permissions : command.clientPermissions.entries(),
        user_permissions : command.userPermissions.entries(),
        nsfw : command.nsfw,
        guild_only : command.guildOnly,
      },
                        true);
    });

    return msg.say('Reloaded the DB commands table.');
  }
};
