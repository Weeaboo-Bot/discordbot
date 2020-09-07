const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
const {news_token } = require('../../config');
const Command = require('../../models/Command');

module.exports = class GlobalNewsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'world-news',
      aliases: ['global-news', 'reuters'],
      group: 'general',
      memberName: 'world-news',
      description: 'Replies with the 5 latest world news headlines',
      throttling: {
        usages: 2,
        duration: 10
      }
    });
  }

  async run(message) {
    // powered by NewsAPI.org
    try {
      const response = await fetch(
        `https://newsapi.org/v2/top-headlines?sources=reddit-r-all&pageSize=5&apiKey=${news_token}`
      );
      const json = await response.json();
      const articleArr = json.articles;
      let processArticle = article => {
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
          message.say(msg);
        }
      }
      await processArray(articleArr);
    } catch (e) {
      message.say('Something failed along the way');
      return console.error(e);
    }
  }
};