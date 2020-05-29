const request = require('snekfetch');
const fs = require('fs');

const { Command } = require('discord.js-commando');

module.exports = class BoobsCommand extends Command{
    constructor(client) {
        super(client, {
            name: 'boobs',
            description: 'Boobs',
            memberName: 'boobs',
            aliases: ['boobsPics'],
            group: 'nsfw'
        });
    }
    run(message){
        var max = 12449;
        var min = 10000;
        var MathRan = Math.floor(Math.random() * (max - min + 0)) + min;
        var MathLoL = Math.round(MathRan);
        if (!message.channel.nsfw) {
            message.say(":underage: NSFW Command. Please switch to NSFW channel in order to use this command.")
        } else {
            request.get("http://media.oboobs.ru/boobs_preview/" + MathLoL + ".jpg").then(r => {
                fs.writeFile(`boobs.jpg`, r.body)
                message.sendFile(r.body)
                fs.unlink(`./boobs.jpg`)
            })
        }
    }

}