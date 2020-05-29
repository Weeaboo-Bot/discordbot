// config.js
const dotenv = require('dotenv');
dotenv.config();
module.exports = {
  token: process.env.token,
  youtube_token: process.env.youtube_token,
  weather_token: process.env.weather_token,
  genius_token: process.env.genius_token,
  news_token: process.env.news_token,
  tenor_token: process.env.tenor_token,
  discord_owner_id: process.env.discord_owner_id,
  prefix: '!',
  GUILDLOG: process.env.GUILDLOG,
  STATUSLOG: process.env.STATUSLOG,
  DMLOG: process.env.DMLOG


};