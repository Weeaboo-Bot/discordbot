const Command = require('../../structures/Command');
const Discord = require('discord.js');
const aq = require('animequote');
const Jikan = require('jikan-node');
const mal = new Jikan();
const moment = require('moment');

module.exports = class AnimeCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'anime',
            group: 'anime',
            memberName: 'anime',
            guildOnly: true,
            description: 'Searches for an anime on MAL!',
            examples: ['!anime <anime name>'],
            args: [
                {
                    key: 'search',
                    prompt: 'What anime would you like to search?',
                    type: 'string',
                },
            ],
        });
    }

    async run(message, { search }) {
        await mal.search('anime',search,'page').then((result) => {

            // Return Top 5 results to user, let user select the correct anime.
            const animeArr = [];
            for (let i = 0; i < result.results.length; i++) {
                animeArr.push(`${i + 1}: ${result.results[i].title}`);
            }
            animeArr.push('exit');
            const animeEmbed = new Discord.MessageEmbed()
                .setColor('#e9f931')
                .setTitle('Choose an anime by commenting a number between 1 and 5')
                .addField('Anime 1', animeArr[0])
                .addField('Anime 2', animeArr[1])
                .addField('Anime 3', animeArr[2])
                .addField('Anime 4', animeArr[3])
                .addField('Anime 5', animeArr[4])
                .addField('Exit', 'exit');
            message.channel.send({ embed: animeEmbed });

            message.channel
                .awaitMessages(
                    function (msg) {
                        return (
                            (msg.content > 0 && msg.content < 6) ||
                            msg.content === 'exit'
                        );
                    },
                    {
                        max: 1,
                        time: 60000,
                        errors: ['time'],
                    }
                )
                .then(function (response) {
                    const animeIndex = parseInt(response.first().content);
                    if (response.first().content === 'exit') {
                        return animeEmbed.delete();
                    }
                    //DO Stuff here
                    //Then search with MAL ID to get better info ?
                    mal.findAnime(result.results[animeIndex - 1].mal_id)
                        .then((anime) => {

                            const embed = new Discord.MessageEmbed()
                                .setColor('#FF9D6E')
                                .setURL(anime.url)
                                .setTitle(
                                    `${anime.title_english ? anime.title_english : 'N/A'} | ${anime.type ? anime.type : 'N/A'}`
                                )
                                .setAuthor(anime.studios[0].name ? anime.studios[0].name : 'N/A')
                                .setDescription(
                                    anime.synopsis.replace(/<[^>]*>/g, '').split('\n')[0]
                                )
                                .addField(
                                    '❯\u2000Information',
                                    `•\u2000\**Japanese Name:** ${
                                        anime.title_japanese ? anime.title_japanese : 'N/A'
                                    }\n\•\u2000\**Age Rating:** ${
                                        anime.rating ? anime.rating : 'N/A'
                                    }\n\•\u2000\**NSFW:** ${anime.rating.includes('R+') ? 'Yes' : 'No'
                                    }`,
                                    true
                                )
                                .addField(
                                    '❯\u2000Stats',
                                    `•\u2000\**Average Rating:** ${anime.score ? anime.score : 'N/A'}\n\•\u2000\**Rating Rank:** ${anime.rank ? anime.rank : 'N/A'}\n\•\u2000\**Popularity Rank:** ${anime.popularity ? anime.popularity : 'N/A'}`,
                                    true
                                )
                                .addField(
                                    '❯\u2000Status',

                                    `•\u2000\**Current Status:** ${
                                        anime.status ? anime.status : 'N/A'
                                    }\n\•\u2000\**Episodes:** ${
                                        anime.episodes ? anime.episodes : 'N/A'
                                    }\n\•\u2000\**Broadcast Time:** ${
                                        anime.broadcast ? anime.broadcast : 'N/A'
                                    }\n\•\u2000\**Premiered:** ${
                                        anime.premiered ? anime.premiered : 'N/A'
                                    }\n\•\u2000\**Start Date:** ${
                                        anime.aired.from ? moment().format(anime.aired.from) : 'N/A'
                                    }\n\•\u2000\**End Date:** ${
                                        anime.aired.to ? moment().format(anime.aired.to) : 'N/A'
                                    }`,
                                    true
                                )
                                .setImage(anime.image_url);
                            return message.channel.send({ embed: embed });
                        })
                        .catch((detailError) => {
                            message.say(
                                'An error has occured when trying to get the MAL ID from mal'
                            );
                            message.client.channels.cache
                                .get(message.client.errorLog)
                                .send({
                                    embed: message.command.discordLogger.errorMessage(
                                        detailError,
                                        message.command.errorTypes.API,
                                        message.command.name,
                                        search
                                    ),
                                });
                        })
                })
                .catch(function (err) {
                    message.client.channels.cache
                        .get(message.client.errorLog)
                        .send({
                            embed: message.command.discordLogger.errorMessage(
                                err,
                                message.command.errorTypes.API,
                                message.command.name,
                                search
                            ),
                        });
                });
        })
    }
};