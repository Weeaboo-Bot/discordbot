const { Command } = require('discord.js-commando')
const discord = require('discord.js');

module.exports = class RemoveChannelCommand extends Command {
    constructor(client) {
        super(client, {
            name:'removechannel',
            group:'channels',
            description:'Removes a Channel from the Server',
            memberName: 'removechannel',
            aliases: ['removechan'],
            args: [
                {
                    key: 'channelName',
                    type: 'string',
                    prompt: 'What is the channel you want to remove?'
                },
                {
                    key: 'channelReason',
                    type: 'string',
                    prompt: 'What is the reason for deleting this channel?'
                },
               

                
            ]
        });
    
    }
   run(message, {channelName,channelReason}) {

        var channelGuild = message.guild;
        var channeList = message.guild.channels.cache;



        for(var charrr in channeList){
            if(channeList[charrr].name == channelName){
                var channel = channeList[charrr];
                channel.delete(channelReason);
            }
        }


               
            
           



    }
}

