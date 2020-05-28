const { Command } = require('discord.js-commando');



module.exports = class ListChannels extends Command{
    constructor(client) {
        super(client, {
            name: 'listchannels',
            description: 'List all the channels in this server',
            group: 'channels',
            memberName: 'listchannels',
            aliases: ['listserverchannels']
        });
    }
    run(message){

        const channels = message.guild.channels;

        //JSON Array of all the roles
        const channelList = channels.cache.toJSON();

        var x = JSON.stringify(channels);

        var msg = ""
        for(var key in channelList){


                msg = `${channelList[key].name} : ${channelList[key].id} NSFW : ${channelList[key].nsfw}`
                message.say(msg)




        }




    }

}