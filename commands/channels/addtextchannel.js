const { Command } = require('discord.js-commando')


module.exports = class AddTextChannelCommand extends Command {
    constructor(client) {
        super(client, {
            name:'addtextchannel',
            group:'channels',
            description:'Add a new Text Channel to the Server',
            memberName: 'addtextchannel',
            aliases: ['addtextchan'],
            args: [
                {
                    key: 'channelName',
                    type: 'string',
                    prompt: 'What is the name for this channel?'
                },
                {
                    key: 'channelLocation',
                    type: 'string',
                    prompt: 'Where should this channel appear in the server?'
                },
                {
                    key: 'channelTopic',
                    type: 'string',
                    prompt: 'What is the topic for this channel?'

                },
                {
                    key: 'channelNSFW',
                    type: 'boolean',
                    prompt: 'Is this a NSFW Channel (true/false)?'
                },
                {
                    key: 'channelReason',
                    type: 'string',
                    prompt: 'What is the reason for adding this channel?'
                }
            ]
        });
    
    }
   run(message, {channelName,channelLocation,channelTopic,channelNSFW,channelReason}) {

        var guild = message.guild;
        var userName = message.author.username;
      //  guild.createRole(data);
     //   var newrole = server.roles.find("name", name);
       // message.author.addrole(newrole);
     
          
                guild.channels.create(channelName,{reason: channelReason, type: text, topic: channelTopic, nsfw: channelNSFW});
               
            
           



    }
}

