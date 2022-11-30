// config.js
const dotenv = require('dotenv');
dotenv.config();

exports.logs = {
    GENERAL_CHAT: process.env.GENERAL_CHAT,
    BOT_COMMANDS_CHAT: process.env.BOT_COMMAND_CHAT,
    BOT_LOG: process.env.BOT_LOG,
    PING_CHANNEL: process.env.PING_CHANNEL,
};

exports.discord = {
    DISCORD_TOKEN: process.env.DISCORD_TOKEN,
    DISCORD_PREFIX: process.env.DISCORD_PREFIX,
    DISCORD_WEBHOOK_ID: process.env.DISCORD_WEBHOOK_ID,
    DISCORD_WEBHOOK_TOKEN: process.env.DISCORD_WEBHOOK_TOKEN,
    DISCORD_OWNER_ID: process.env.DISCORD_OWNER_ID,
    DISCORD_INVITE: process.env.DISCORD_INVITE,
    GUILD_ID: process.env.GUILD_ID,
};

exports.api = {
    ALPHA_KEY: process.env.ALPHA_VANTAGE,
    LOGIN_URL:
        'https://us-central1-weaboo-bot-73b07.cloudfunctions.net/api/login',
    FIREBASE_KEY: process.env.FIREBASE_WEB_API_KEY,
    FIREBASE_STORAGE_LINK: process.env.FIREBASE_STORAGE_LINK,
    GOOGLE_KEY: process.env.GOOGLE_API_KEY,
    GOOGLE_CSE_KEY: process.env.GOOGLE_CSE_KEY,
    GENIUS_CLIENT_ID: process.env.GENIUS_CLIENT_ID,
    GENIUS_CLIENT_SECRET: process.env.GENIUS_CLIENT_SECRET,
    GENIUS_KEY: process.env.GENIUS_ACCESS_TOKEN,
    GITHUB_KEY: process.env.GITHUB_KEY,
    GIPHY_KEY: process.env.GIPHY_KEY,
    NEWS_KEY: process.env.NEWS_KEY,
    NEW_RELIC_LOG: process.env.NEW_RELIC_LOG,
    NEW_RELIC_KEY: process.env.NEW_RELIC_LICENSE_KEY,
    WEATHER_KEY: process.env.WEATHER_KEY,
    YOUTUBE_KEY: process.env.GOOGLE_API_KEY,
    REDIS_HOST: process.env.REDIS_HOST,
    REDIS_PASS: process.env.REDIS_PASS,
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASS: process.env.EMAIL_PASS,
    SUCCESS_EMOJI_ID: process.env.SUCCESS_EMOJI_ID,
    CAT_API_KEY: process.env.CAT_API_KEY,
    AZURE_KEY_A: process.env.AZURE_KEY_A,
    AZURE_ENDPOINT: process.env.AZURE_ENDPOINT,
    AZURE_LOCATION: process.env.AZURE_LOCATION,
};
