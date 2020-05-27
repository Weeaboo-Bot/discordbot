const ytdl = require('ytdl-core');

const queue = new Map();
const serverQueue = queue.get(message.guild.id);

async function execute(message, serverQueue) {
    const args = message.content.split(" ");
  
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel)
      return message.channel.send(
        "You need to be in a voice channel to play music!"
      );
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
      return message.channel.send(
        "I need the permissions to join and speak in your voice channel!"
      );
    }
  }

  const songInfo = await ytdl.getInfo(args[1]);
  const song = {
      title: songInfo.title,
      url: songInfo.video_url
  };


  if (!serverQueue) {

}else {
 serverQueue.songs.push(song);
 console.log(serverQueue.songs);
 return message.channel.send(`${song.title} has been added to the queue!`);
}

// Creating the contract for our queue
const queueContruct = {
    textChannel: message.channel,
    voiceChannel: voiceChannel,
    connection: null,
    songs: [],
    volume: 5,
    playing: true,
   };
   // Setting the queue using our contract
   queue.set(message.guild.id, queueContruct);
   // Pushing the song to our songs array
   queueContruct.songs.push(song);
   
   try {
    // Here we try to join the voicechat and save our connection into our object.
    var connection = await voiceChannel.join();
    queueContruct.connection = connection;
    // Calling the play function to start a song
    play(message.guild, queueContruct.songs[0]);
   } catch (err) {
    // Printing the error message if the bot fails to join the voicechat
    console.log(err);
    queue.delete(message.guild.id);
    return message.channel.send(err);
   }

   function play(guild, song) {
    const serverQueue = queue.get(guild.id);
    if (!song) {
      serverQueue.voiceChannel.leave();
      queue.delete(guild.id);
      return;
    }
  }

  function play(guild, song) {
    const serverQueue = queue.get(guild.id);
    if (!song) {
      serverQueue.voiceChannel.leave();
      queue.delete(guild.id);
      return;
    }
  }




  function skip(message, serverQueue) {
    if (!message.member.voice.channel)
      return message.channel.send(
        "You have to be in a voice channel to stop the music!"
      );
    if (!serverQueue)
      return message.channel.send("There is no song that I could skip!");
    serverQueue.connection.dispatcher.end();
  }


  function stop(message, serverQueue) {
    if (!message.member.voice.channel)
      return message.channel.send(
        "You have to be in a voice channel to stop the music!"
      );
    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end();
  }
  



const play = {
    name: 'play',
    description: 'Load a URL',
    args: true,
    usage: '<URL>',
    execute(message,serverQueue)
}

const skip = {
    name: 'skip',
    description: 'Skip the Current Song',
    args: false,
    skip(message,serverQueue)
}

const pause = {
    name: 'pause',
    description: 'Pause the Current Song',
    args: false,
    pause(message,serverQueue)
}

const stop = {
    name: 'stop',
    description: 'Stop the Current Song',
    args: false,
    stop(message,serverQueue)
}

const volume = {
    name: 'volume',
    description: 'Set the Volume',
    args: true,
    usage: '<Volume Amount>',
    volume(message,serverQueue)
}

