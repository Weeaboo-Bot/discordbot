const Command = require('../../structures/Command');

module.exports = class RemoveSongCommand extends Command {
  constructor(client) {
    super(client, {
      name : 'remove',
      memberName : 'remove',
      group : 'music',
      description : 'Remove a specific song from queue',
      guildOnly : true,
      args : [
        {
          key : 'songNumber',
          prompt : 'What song number do you want to remove from queue?',
          type : 'integer',
        },
      ],
    });
  }
  run(message, {songNumber}) {
    if (songNumber < 1 && songNumber >= message.guild.musicData.queue.length) {
      return message.reply('Please enter a valid song number');
    }
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel)
      return message.reply('Join a channel and try again');

    if (typeof message.guild.musicData.songDispatcher == 'undefined' ||
        message.guild.musicData.songDispatcher == null) {
      return message.reply('There is no song playing right now!');
    }

    message.guild.musicData.queue.splice(songNumber - 1, 1);
    return message.say(`Removed song number ${songNumber} from queue`);
  }
};
