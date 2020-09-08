const Command = require('../../models/Command');
const Discord = require('discord.js');
const axios = require('axios');
const {error_log } = require('../../config');
const {errorMessage} = require('../../helpers/logHandler');
const ErrorEnum = require('../../helpers/errorTypes');


module.exports = class CommandTemplate extends Command{
    constructor(client) {
        super(client, {
            name:'commandname',
            memberName: 'commandname',
            aliases: ['commandalias'],
            description: 'command description',
            group: 'utility',
            args: [
                {
                    key: 'arg1',
                    type: 'string',
                    prompt: 'arg1 Prompt'
                },
                {
                    key: 'arg2',
                    type: 'string',
                    prompt: 'arg2 Prompt'
                }
                //More Args
            ]
        });

    }
    run(message, {arg1,arg2}){
        //Execute Command Function Here


        //If you next Axios HTTP Stuff - Uncomment the below Section
        /*
        await axios.get('URL')
            .then(function(res){
            })
            .catch(function(err){
                message.client.channels.cache.get(error_log).send({embed: errorMessage(err,ErrorEnum.API,message.command.name)});
            });
         */


    }


};