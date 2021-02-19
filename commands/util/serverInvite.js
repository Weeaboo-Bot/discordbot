const Command = require('../../structures/Command');
const {stripIndents} = require('common-tags');
const permissions = require('../../assets/json/permissions');
const {errorMessage} = require('../../util/logHandler');
const ErrorEnum = require('../../util/errorTypes.json');

module.exports = class ServerInviteCommand extends Command {
  constructor(client) {
    super(client, {
      name : 'serverinvite',
      group : 'util',
      memberName : 'serverinvite',
      description : "Responds with the channels's invite links.",
      guarded : true,
    });
  }

  async run(msg) {
    const inviteLink =
        await msg.channel
            .createInvite({
              maxAge : 10 * 60 * 1000,
              maxUses : 5,
            },
                          `Requested with command by ${msg.author.tag}`)
            .catch((error) => {
              console.log(error);
              msg.client.channel.cache.get(msg.client.errorLog).send({
                embed : errorMessage(error, ErrorEnum.API, msg.command.name),
              });
            });

    msg.reply(
        inviteLink
            ? `Here's your invite: ${inviteLink}`
            : 'There has been an error during the creation of the invite');
  }
};
