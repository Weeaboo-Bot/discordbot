const Command = require('../../structures/Command');

module.exports = class NoMoreCommand extends Command {
  constructor(client) {
    super(client, {
      name : 'nomore',
      guildOnly : true,
      aliases : [ 'nm', 'nonsfw', 'sfw' ],
      group : 'core',
      memberName : 'nomore',
      clientPermissions : [ 'MANAGE_CHANNELS' ],
      description : 'No more NSFW!',
      details : 'Optionally have me set it for you!',
      examples : [ '!nomore' ],
    });
  }

  async run(message) {
    if (!message.channel.nsfw) {
      return message.channel.send(
          "Looks like you've got it all set up already! This channel isn't NSFW! Try `~howto` to see how to make it into an NSFW channel!");
    }
    message.channel.send(
        "__**Here's how to set a channel to SFW!**__\n**1)** Click the __channel settings cog__ beside the channel name!\n**2)** Click the __NSFW switch__ right under the channel topic box!\n**3)** You're done! Save the settings and there's your pure, innocent channel back!\nhttps://b.catgirlsare.sexy/i6CE.png\n**Would you like me to make this channel SFW for you?** `(y/n)`");

    const msgs = await message.channel.awaitMessages(
        (res) => res.author.id === message.author.id, {
          max : 1,
          time : 30000,
        });
    if (!msgs.size ||
        !['y', 'yes'].includes(msgs.first().content.toLowerCase())) {
      return message.channel.send('Cancelled command!');
    }
    if ([ 'n', 'no' ].includes(msgs.first().content.toLowerCase())) {
      return message.channel.send('Cancelled command!');
    }

    if (!message.guild.member(message.author)
             .hasPermission('MANAGE_CHANNELS')) {
      return message.channel.send(
          "Hold on..you don't have the permissions to do this! @A@ beanboozled aagain...");
    }

    try {
      await message.channel.setNSFW(false, `set by ${message.author.tag}`);
    } catch (err) {
      await message.channel.send(`❎ | **${
          message.author
              .username}**, there was an error trying to make this channel into a SFW channel! \`${
          err}\``);
    }

    return await message.channel.send(
        `✅ | **${message.author.username}**, successfully made **${
            message.channel.name}** into a SFW channel!`);
  }
};
