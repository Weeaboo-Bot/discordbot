const { MessageEmbed } = require('discord.js');
const Command = require('../../structures/Command');

module.exports = class NewsCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'news',
            aliases: ['topic-news'],
            group: 'general',
            memberName: 'topic-news',
            description:
                'Replies with the 5 latest news articles for the requested topic',
            throttling: {
                usages: 2,
                duration: 10,
            },
            args: [
                {
                    key: 'topic',
                    type: 'string',
                    prompt: 'What Topic would you like to get news for ?',
                },
            ],
        });
    }

    async run(message, { topic }) {
        // powered by NewsAPI.org

        try {
            const response = await this.apiReq.get(`https://newsapi.org/v2/everything?q=${topic}&sortBy=publishedAt&pageSize=5&source=associated-press&apiKey=${message.client.apiKeys.NEWS_KEY}`);
            const articleArr = response.data.articles;
            const processArticle = (article) => {
                const embed = new MessageEmbed()
                    .setColor('#FF4F00')
                    .setTitle(article.title)
                    .setURL(article.url)
                    .setAuthor(article.author)
                    .setDescription(article.description)
                    .setThumbnail(article.urlToImage)
                    .setTimestamp(article.publishedAt)
                    .setFooter('powered by NewsAPI.org');
                return embed;
            };
            async function processArray(array) {
                for (const article of array) {
                    const msg = await processArticle(article);
                    await message.say(msg);
                }
            }
            await processArray(articleArr);
        } catch (e) {
            await message.say('Something failed along the way');
            return console.error(e);
        }
    }
};
