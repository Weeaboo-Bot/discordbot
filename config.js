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
  guild_log: process.env.guild_log,
  status_log: process.env.status_log,
  dm_log: process.env.dm_log,
  support_log: process.env.support_log,
  general_id: process.env.general_id,
  osu_key: process.env.osu_key,
  google_api_key: process.env.google_api_key,
  google_cse_key: process.env.google_cse_key,
  giphy_key: process.env.giphy_key,
  client_id: process.env.client_id,
  azure_translate_api: process.env.azure_translate_api,
  azure_img_api: process.env.azure_img_api


};