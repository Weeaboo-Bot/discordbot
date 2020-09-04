const Command = require('../../models/Command');
const Discord = require('discord.js');
const GoogleImages = require("google-images");
const {google_token,google_cse_key} = require('../../config');

module.exports = class ImgCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'img',
            aliases: ['google', 'image', 'googleimage'],
            group: 'utility',
            memberName: 'img',
            guildOnly: true,
            description: 'Searches for your query on google images!',
            examples: ['~img [query]'],
            details: 'Safe search is off for this command, please be considerate!',
            throttling: {
                usages: 1,
                duration: 5
            }
        });
    }

    async run(message) {
        const gClient = new GoogleImages(google_cse_key, google_token);

        let search = message.content.split(/\s+/g).slice(1).join(" ");

        if (!search) return message.channel.send('Please specify something to search.');

        if (search.length > 0) {
            try {
                const response = await gClient.search(search, {
                    safe: "off"
                });
                if (!response) {
                    message.channel.send("Nothing Found!");
                    
                } else {
                    let image = response[0].url;
                    const embed = await new Discord.MessageEmbed()
                        .setAuthor(`${search}`, 'https://a.safe.moe/F3RvU.png')
                        .setColor(`#3369E8`)
                        .setImage(image);
                    message.channel.send({ embed });
                }

            } catch (err) {
                message.channel.send("<:NOTLIKETHIIIIIIIIIIIIIIIIIIIIIIS:371071292146843658> Something went wrong with the search.");
                return console.error(err);
            }
        } else {
            return message.channel.send("Invalid Parameters(???)");
        }
    }
};