const Command = require('../../structures/Command');
const { stripIndents } = require('common-tags');
const { reactIfAble } = require('../../util/Util');
const scores = require('../../assets/json/anagramica');
const pool = 'abcdefghijklmnopqrstuvwxyz'.split('');
const { SUCCESS_EMOJI_ID, FAILURE_EMOJI_ID } = require('../../config').api;

module.exports = class AnagramicaCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'anagramica',
            aliases: ['anagram-game', 'anagram-quiz', 'anagram', 'anagrams'],
            group: 'games-sp',
            memberName: 'anagramica',
            description:
                'Try to find all the anagrams for a given set of letters.',
            credit: [
                {
                    name: 'Max Irwin',
                    url: 'http://binarymax.com/',
                    reason: 'Original "Anagramica" Game, API',
                    reasonURL: 'http://anagramica.com/',
                },
            ],
            args: [
                {
                    key: 'time',
                    prompt:
                        'How long should the game last in seconds? Max 90, min 15.',
                    type: 'integer',
                    default: 45,
                    max: 90,
                    min: 15,
                },
            ],
        });
    }

    async run(msg, { time }) {
        const current = this.client.games.get(msg.channel.id);
        if (current) {
            return msg.reply(
                `Please wait until the current game of \`${current.name}\` is finished.`
            );
        }
        try {
            this.client.games.set(msg.channel.id, { name: this.name });
            const { valid, letters } = await this.fetchList(msg);
            let points = 0;
            await msg.reply(stripIndents`
				**You have ${time} seconds to provide anagrams for the following letters:**
				${letters.map((letter) => `\`${letter.toUpperCase()}\``).join(' ')}
			`);
            const picked = [];
            const filter = (res) => {
                if (res.author.id !== msg.author.id) return false;
                if (picked.includes(res.content.toLowerCase())) return false;
                const score = this.getScore(letters, res.content.toLowerCase());
                if (!score) return false;
                if (!valid.includes(res.content.toLowerCase())) {
                    points -= score;
                    picked.push(res.content.toLowerCase());
                    reactIfAble(res, res.author, FAILURE_EMOJI_ID, '❌');
                    return false;
                }
                points += score;
                picked.push(res.content.toLowerCase());
                reactIfAble(res, res.author, SUCCESS_EMOJI_ID, '✅');
                return true;
            };
            const msgs = await msg.channel.awaitMessages(filter, {
                time: time * 1000,
            });
            const highScoreGet = await this.client.redis.get('anagramica');
            const highScore = highScoreGet
                ? Number.parseInt(highScoreGet, 10)
                : null;
            if (!highScore || highScore < points) {
                await this.client.redis.set('anagramica', points);
            }
            this.client.games.delete(msg.channel.id);
            if (!msgs.size) {
                return msg.reply(stripIndents`
					Couldn't even think of one? Ouch.
					${
                        !highScore || highScore < points
                            ? '**New High Score!** Old:'
                            : 'High Score:'
                    } ${highScore}
				`);
            }
            if (points < 1) {
                return msg.reply(stripIndents`
					Ouch, your final score was **${points}**. Try harder next time!
					${
                        !highScore || highScore < points
                            ? '**New High Score!** Old:'
                            : 'High Score:'
                    } ${highScore}
				`);
            }
            return msg.reply(stripIndents`
				Nice job! Your final score was **${points}**!
				${
                    !highScore || highScore < points
                        ? '**New High Score!** Old:'
                        : 'High Score:'
                } ${highScore}
			`);
        } catch (err) {
            this.client.games.delete(msg.channel.id);
            return msg.reply(
                `Oh no, an error occurred: \`${err.message}\`. Try again later!`
            );
        }
    }

    async fetchList(msg) {
        const letters = [];
        for (let i = 0; i < 10; i++) {
            letters.push(pool[Math.floor(Math.random() * pool.length)]);
        }
        const { body } = await msg.command.axiosConfig.get(
            `http://www.anagramica.com/all/${letters.join('')}`
        );
        return { valid: body.all, letters };
    }

    getScore(letters, word) {
        let score = 0;
        for (const letter of word.split('')) {
            if (!letters.includes(letter)) return null;
            score += scores[letter];
        }
        return score;
    }
};
