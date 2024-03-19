const Command = require('../../structures/Command');
const Discord = require('discord.js');

module.exports = class CreatePlayerCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'create-player',
      group: 'casino-utils',
      memberName: 'create-player',
      description: 'Create a user in the Casino',
      args: [
        {
          key: 'user',
          prompt: 'Which user do you want to create in the Casino?',
          type: 'user',
          default: (msg) => msg.author,
        },
      ],
    });
  }

  async run(msg, { user }) {
    // if (msg.channel.id !== this.client.casinoChannel) { // Replace with the actual channel ID
    //   return; // Do nothing if channel doesn't match
    // }

    try {
      // look for existing user
      const existingUser = await this.client.casino.getUser(user.id);
      if (existingUser) return msg.reply('User already exists in the Casino');

      // First attach the CasinoPlayer role
      
      const createdUser = await this.client.casino.createUser(
        {
          userId: user.id,
          userName: user.tag,
          bot: user.bot,
          discordCreatedAt: user.createdAt,
        }, // user data
        {
          balance: 1000,
        }, // balance data
      );
      return msg.reply(
        `User created successfully at ${this.client.casino.convertTimestampToDiscordFormat(createdUser.createdAt)}`);
    } catch (error) {
      msg.client.botLogger({
        embed: msg.client.errorMessage(
          error,
          msg.client.errorTypes.FIREBASE,
          msg.command.name
        ),
      });
    }

  }

};
