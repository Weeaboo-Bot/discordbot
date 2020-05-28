const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
const {news_token } = require('../../config');
const { Command } = require('discord.js-commando');

module.exports = class NewsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'news',
      aliases: ['topic-news'],
      group: 'general',
      memberName: 'topic-news',
      description: 'Replies with the 5 latest news articles for the requested topic',
      throttling: {
        usages: 2,
        duration: 10
      },
      args: [
        {
          key: 'topic',
          type: 'string',
          prompt: 'What Topic would you like to get news for ?'
        }
      ]
    });
  }

  async run(message, {topic}) {
    // powered by NewsAPI.org
    try {
      const response = await fetch(
       
        `https://newsapi.org/v2/everything?q=${topic}&sortBy=publishedAt&pageSize=5&source=associated-press&apiKey=${news_token}`
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