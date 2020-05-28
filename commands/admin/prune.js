module.exports = {
    name: 'prune',
    description: 'Prune Messages from Channel',
    args: true,
    cooldown: 5,
    usage: '<# Messages to Prune>',

    execute(message,args){
        message.channel.bulkDelete(args[0],true);
        message.channel.send(`${args[0]} Messages Removed`)
    }

}