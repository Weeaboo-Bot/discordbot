const Command = require('../../structures/Command');
const Discord = require('discord.js');
const leetCodeAPI = require('../../config').api.LEETCODE_API;
const request = require('node-superfetch');

module.exports = class DailyLCCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'daily-lc',
            aliases: ['daily-leet', 'daily-leetcode', 'leetcode-daily', 'leet-daily'],
            group: 'core',
            memberName: 'daily-lc',
            guildOnly: true,
            description: 'Get Daily LeetCode Question!',
            examples: ['!daily-lc'],
        });
    }

    async run(message) {
        const embed = new Discord.MessageEmbed();
        const DAILY_CODING_CHALLENGE_QUERY = `
        query questionOfToday {
            activeDailyCodingChallengeQuestion {
                date
                userStatus
                link
                question {
                    acRate
                    difficulty
                    freqBar
                    frontendQuestionId: questionFrontendId
                    isFavor
                    paidOnly: isPaidOnly
                    status
                    title
                    titleSlug
                    hasVideoSolution
                    hasSolution
                    topicTags {
                        name
                        id
                        slug
                    }
                }
            }
        }`

        await request
            .post(leetCodeAPI, {
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: DAILY_CODING_CHALLENGE_QUERY })
            })
            .then(function (res) {
                const topicList = [];
                res.body.data.activeDailyCodingChallengeQuestion.question.topicTags.forEach((topic) => {
                    topicList.push(topic.name);
                })
                embed.setColor('#FBCFCF');
                embed.setImage(`https://assets.leetcode.com/static_assets/public/webpack_bundles/images/logo-dark.e99485d9b.svg`);
                embed.addField('❯ Date', res.body.data.activeDailyCodingChallengeQuestion.date)
                embed.addField('❯ Difficulty', res.body.data.activeDailyCodingChallengeQuestion.question.difficulty)
                embed.addField('❯ Title', res.body.data.activeDailyCodingChallengeQuestion.question.title)
                embed.addField('❯ Topics', topicList.toString())
                embed.addField('❯ Link', `https://leetcode.com${res.body.data.activeDailyCodingChallengeQuestion.link}`)
                return message.channel.send(
                    'Here is Today\'s Daily Leetcode! Good Luck!',
                    { embed: embed }
                );
            })
            .catch(function (error) {
                // handle error
                message.client.botLogger({
                    embed: message.client.errorMessage(
                        error,
                        message.client.errorTypes.API,
                        message.command.name
                    ),
                });
            });
    }
};
