
/**
 * Kick Command
 */
const kick =  {
    name: 'kick',
    description: 'kick a user from the server.',
    args: true,
    usage: `<Username of Member to Kick>`,
    guildOnly: true,
}



/**
 * Prune Command
 */
module.exports = {
    name: 'prune',
    description: 'Prune Messages from Channel',
    args: true,
    usage: `<# Of Messages to Delete>`,
    execute(message,args){
        //args[0] Would be the # of Messages to delete.
        message.channel.bulkDelete(args[0],true);
    }
}


//module.exports = { kick,prune };

