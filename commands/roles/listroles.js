const { Command } = require('discord.js-commando');



module.exports = class ListRolesCommand extends Command{
    constructor(client) {
        super(client, {
            name: 'listroles',
            description: 'List all the roles in this server',
            group: 'roles',
            memberName: 'listroles',
            aliases: ['listserverroles']
        });
    }
    run(message){

        const roles = message.guild.roles;

        //JSON Array of all the roles
        const roleList = roles.cache.toJSON();

        var x = JSON.stringify(roleList);

        var msg = ""
        for(var key in roleList){
            delete roleList[0]

            msg = `${roleList[key].name} : ${roleList[key].id}\n`

            message.say(msg)





        }




    }

}