const Command = require('../../structures/Command');

module.exports = class LoginCommand extends Command {
  constructor(client) {
    super(client, {
      name : 'login',
      guildOnly : true,
      aliases : [ 'signup', 'signin' ],
      group : 'core',
      memberName : 'login',
      clientPermissions : [ 'MANAGE_CHANNELS' ],
      description : 'Tells you how to login to FireBase!',
      examples : [ '!login' ],
    });
  }

  async run(message) {
    return await message.channel.send(
        `✅ | **${message.author.username}**, here is the link for login: ${
            message.client.apiKeys.LOGIN_URL}`);
  }
};
