const Command = require('../../structures/Command');
const Discord = require('discord.js');
const aq = require('animequote');
const Kitsu = require('kitsu.js');
const kitsu = new Kitsu();

module.exports = class AnimeCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'anime',
            group: 'anime',
            memberName: 'anime',
            guildOnly: true,
            description: 'Searches for an anime on Kitsu.io!',
            examples: ['!anime <anime name>'],
        });
    }

    run(message) {
        var search = message.content.split(/\s+/g).slice(1).join(' ');

        if (!search) {
            kitsu.searchAnime(aq().quoteanime).then((result) => {
                const anime = result[0];

                const embed = new Discord.MessageEmbed()
                    .setColor('#FF9D6E')
                    .setAuthor(
                        `${anime.titles.english} | ${anime.showType}`,
                        anime.posterImage.original
                    )
                    .setDescription(
                        anime.synopsis.replace(/<[^>]*>/g, '').split('\n')[0]
                    )
                    .addField(
                        '❯\u2000Information',
                        `•\u2000\**Japanese Name:** ${
                            anime.titles.romaji
                        }\n\•\u2000\**Age Rating:** ${
                            anime.ageRating
                        }\n\•\u2000\**NSFW:** ${anime.nsfw ? 'Yes' : 'No'}`,
                        true
                    )
                    .addField(
                        '❯\u2000Stats',
                        `•\u2000\**Average Rating:** ${anime.averageRating}\n\•\u2000\**Rating Rank:** ${anime.ratingRank}\n\•\u2000\**Popularity Rank:** ${anime.popularityRank}`,
                        true
                    )
                    .addField(
                        '❯\u2000Status',
                        `•\u2000\**Episodes:** ${
                            anime.episodeCount ? anime.episodeCount : 'N/A'
                        }\n\•\u2000\**Start Date:** ${
                            anime.startDate
                        }\n\•\u2000\**End Date:** ${
                            anime.endDate ? anime.endDate : 'Still airing'
                        }`,
                        true
                    )
                    .setImage(anime.posterImage.original);
                return message.channel.send(
                    `Try watching **${anime.titles.english}**!`,
                    { embed: embed }
                );
            });
        } else {
            var search = message.content.split(/\s+/g).slice(1).join(' ');

            kitsu
                .searchAnime(search)
                .then((result) => {
                    if (result.length === 0) {
                        return message.channel.send(
                            `No results found for **${search}**!`
                        );
                    }

                    const anime = result[0];

                    const embed = new Discord.MessageEmbed()
                        .setColor('#FF9D6E')
                        .setAuthor(
                            `${
                                anime.titles.english
                                    ? anime.titles.english
                                    : search
                            } | ${anime.showType}`,
                            anime.posterImage.original
                        )
                        .setDescription(
                            anime.synopsis
                                .replace(/<[^>]*>/g, '')
                                .split('\n')[0]
                        )
                        .addField(
                            '❯\u2000Information',
                            `•\u2000\**Japanese Name:** ${
                                anime.titles.romaji
                            }\n\•\u2000\**Age Rating:** ${
                                anime.ageRating
                            }\n\•\u2000\**NSFW:** ${anime.nsfw ? 'Yes' : 'No'}`,
                            true
                        )
                        .addField(
                            '❯\u2000Stats',
                            `•\u2000\**Average Rating:** ${anime.averageRating}\n\•\u2000\**Rating Rank:** ${anime.ratingRank}\n\•\u2000\**Popularity Rank:** ${anime.popularityRank}`,
                            true
                        )
                        .addField(
                            '❯\u2000Status',
                            `•\u2000\**Episodes:** ${
                                anime.episodeCount ? anime.episodeCount : 'N/A'
                            }\n\•\u2000\**Start Date:** ${
                                anime.startDate
                            }\n\•\u2000\**End Date:** ${
                                anime.endDate ? anime.endDate : 'Still airing'
                            }`,
                            true
                        )
                        .setImage(anime.posterImage.original);
                    return message.channel.send({ embed });
                })
                .catch((err) => {
                    console.log(err);
                    return message.channel.send(
                        `No results found for **${search}**!`
                    );
                });
        }
    }
};
