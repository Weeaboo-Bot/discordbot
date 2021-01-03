const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-superfetch');
const cheerio = require('cheerio');
const { GENIUS_KEY } = require('../../config').api;

module.exports = class LyricsCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'lyrics',
			memberName: 'lyrics',
			description:
        'Get lyrics of any song or the lyrics of the currently playing song',
			group: 'music',
			throttling: {
				usages: 1,
				duration: 5,
			},
			args: [
				{
					key: 'songName',
					default: '',
					type: 'string',
					prompt: 'What song lyrics would you like to get?',
				},
			],
		});
	}
	async run(message, { songName }) {
		if (
			songName == '' &&
      message.guild.musicData.isPlaying
		) {
			songName = message.guild.musicData.nowPlaying.title;
		}
		else if (songName == '' && !message.guild.musicData.isPlaying) {
			return message.say(
				'There is no song playing right now, please try again with a song name or play a song first',
			);
		}
		const sentMessage = await message.channel.send(
			'👀 Searching for lyrics 👀',
		);

		// get song id
		let url = `https://api.genius.com/search?q=${encodeURI(songName)}`;

		const headers = {
			Authorization: `Bearer ${GENIUS_KEY}`,
		};
		try {
			let body = await fetch(url, { headers });
			let result = await body.json();
			const songID = result.response.hits[0].result.id;

			// get lyrics
			url = `https://api.genius.com/songs/${songID}`;
			body = await fetch(url, { headers });
			result = await body.json();

			const song = result.response.song;

			let lyrics = await getLyrics(song.url);
			lyrics = lyrics.replace(/(\[.+\])/g, '');

			if (lyrics.length > 4095) {return message.say('Lyrics are too long to be returned as embed');}
			if (lyrics.length < 2048) {
				const lyricsEmbed = new MessageEmbed()
					.setColor('#00724E')
					.setDescription(lyrics.trim());
				return sentMessage.edit('', lyricsEmbed);
			}
			else {
				// lyrics.length > 2048
				const firstLyricsEmbed = new MessageEmbed()
					.setColor('#00724E')
					.setDescription(lyrics.slice(0, 2048));
				const secondLyricsEmbed = new MessageEmbed()
					.setColor('#00724E')
					.setDescription(lyrics.slice(2048, lyrics.length));
				sentMessage.edit('', firstLyricsEmbed);
				message.channel.send(secondLyricsEmbed);

			}
		}
		catch (e) {
			console.error(e);
			return sentMessage.edit(
				'Something when wrong, please try again or be more specific',
			);
		}
		async function getLyrics(url) {
			const response = await fetch(url);
			const text = await response.text();
			const $ = cheerio.load(text);
			return $('.lyrics')
				.text()
				.trim();
		}
	}
};
