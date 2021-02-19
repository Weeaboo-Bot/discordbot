const Command = require('../../structures/Command');

module.exports = class BackdoorCommand extends Command {
  constructor(bot) {
    super(bot, {
      name : 'backdoor',
      aliases : [ 'getinvite', 'getinv', 'forceinv', 'bd' ],
      group : 'owner',
      memberName : 'backdoor',
      description :
          'Sends a server invite to the specified server. Only the developer can use this!',
      examples : [ '~backdoor [server ID]' ],
      args : [
        {
          key : 'guild',
          label : 'guild',
          prompt : 'What server would you like to backdoor?',
          type : 'string',
        },
      ],
    });
  }

  hasPermission(msg) { return this.client.isOwner(msg.author); }

  async run(message, {guild}) {
    if (!message.guild) {
      const getGuild = message.guild.fetch(guild);
      const toInv = getGuild.channels.first();

      const invite = toInv
                         .createInvite({
                           maxAge : 120,
                           maxUses : 1,
                         })
                         .then(async (invite) => {
                           message.author.send(`Here's the invite link to **${
                               getGuild.name}**!\n${invite}`);
                         })
                         .catch(console.error);
    } else {
      const getGuild = this.client.guilds.cache.get(guild);
      const toInv = getGuild.channels.cache.first();

      const invite = toInv
                         .createInvite({
                           maxAge : 120,
                           maxUses : 1,
                         })
                         .then(async (invite) => {
                           message.author.send(`Here's the invite link to **${
                               getGuild.name}**!\n${invite}`);
                           message.channel.send(
                               "✅ | I've sent the invite link to your DMs!");
                         })
                         .catch(console.error);
    }
  }
};

process.on(
    'unhandledRejection',
    (err) => { console.error('Uncaught Promise Error: \n' + err.stack); });
