// config.js
const dotenv = require('dotenv');
dotenv.config();
exports.config = {
	// DISCORD INFO
	DISCORD_TOKEN: process.env.DISCORD_TOKEN,
	DISCORD_PREFIX: process.env.DISCORD_PREFIX,
	DISCORD_WEBHOOK_ID: process.env.DISCORD_WEBHOOK_ID,
	DISCORD_WEBHOOK_TOKEN: process.env.DISCORD_WEBHOOK_TOKEN,
	DISCORD_OWNER_ID: process.env.DISCORD_OWNER_ID,
	DISCORD_INVITE: process.env.DISCORD_INVITE,
	// CHANNEL INFO
	GENERAL_CHAT: process.env.GENERAL_CHAT,
	BOT_COMMANDS_CHAT: process.env.BOT_COMMAND_CHAT,
	REPORT_LOG: process.env.REPORT_LOG,
	JOIN_LEAVE_LOG: process.env.JOIN_LEAVE_LOG,
	AUDIT_LOG: process.env.AUDIT_LOG,
	BOT_LOG: process.env.BOT_LOG,
	DM_LOG: process.env.DM_LOG,
	EVENT_LOG: process.env.EVENT_LOG,
	ERROR_LOG: process.env.ERROR_LOG,
	GUILD_LOG: process.env.GUILD_LOG,
	STATUS_LOG: process.env.STATUS_LOG,
	SUPPORT_LOG: process.env.SUPPORT_LOG,
	WEBHOOK_LOG: process.env.WEBHOOK_LOG,
	// API KEYS
	FIREBASE_KEY: process.env.FIREBASE_WEB_API_KEY,
	GOOGLE_KEY: process.env.GOOGLE_API_KEY,
	GENIUS_CLIENT_ID: process.env.GENIUS_CLIENT_ID,
	GENIUS_CLIENT_SECRET: process.env.GENIUS_CLIENT_SECRET,
	GENIUS_KEY: process.env.GENIUS_ACCESS_TOKEN,
	GITHUB_KEY: process.env.GITHUB_KEY,
	GIPHY_KEY: process.env.GIPHY_KEY,
	NEWS_KEY: process.env.NEWS_KEY,
	WEATHER_KEY: process.env.WEATHER_KEY,
	YOUTUBE_KEY: process.env.YOUTUBE_KEY,
	REDIS_HOST: process.env.REDIS_HOST,
	REDIS_PASS: process.env.REDIS_PASS,
	EMAIL_USER: process.env.EMAIL_USER,
	EMAIL_PASS: process.env.EMAIL_PASS,
};

exports.firebaseConfig = {
	apiKey: process.env.FIREBASE_WEB_API_KEY,
	authDomain: 'weaboo-bot-73b07.firebaseapp.com',
	projectId: 'weaboo-bot-73b07',
	storageBucket: 'weaboo-bot-73b07.appspot.com',
	messagingSenderId: '512545282964',
	appId: '1:512545282964:web:b1d300c44da318cbb68d81',
	measurementId: 'G-QBSB8CBTL6',
};

exports.oauthConfig = {
	clientID: process.env.DISCORD_CLIENT_ID,
	clientSecret: process.env.DISCORD_CLIENT_SECRET,
	scopes: ['identify', 'email', 'guilds.join', 'guilds'],
};
