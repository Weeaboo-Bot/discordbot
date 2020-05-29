const Discord = require('discord.js');
const {error_log} = require('../config');

function errorMessage(error,error_type,error_command){

    return new Discord.MessageEmbed()
        .setTitle('Command: ' + error_command + '\nError Type: ' +  error_type)
        .setColor("RED")
        .addField('Error Message', `${error.message}`, true)
        .addField('Error URL', `${error.config.url}`, true)
        .setTimestamp()


}

module.exports = {
    errorMessage,

}

