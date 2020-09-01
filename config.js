// config.js
const dotenv = require('dotenv');
dotenv.config();
module.exports = {
	token: process.env.token,
	weather_token: process.env.weather_token,
	genius_token: process.env.genius_token,
	news_token: process.env.news_token,
	tenor_token: process.env.tenor_token,
	discord_owner_id: process.env.discord_owner_id,
	server_id: process.env.server_id,
	prefix: process.env.prefix,
	guild_log: process.env.guild_log,
	status_log: process.env.status_log,
	dm_log: process.env.dm_log,
	support_log: process.env.support_log,
	error_log: process.env.error_log,
	general_id: process.env.general_id,
	osu_key: process.env.osu_key,
	google_token: process.env.google_token,
	google_cse_key: process.env.google_cse_key,
	giphy_key: process.env.giphy_key,
	client_id: process.env.client_id,
	role_channel_ud: process.env.role_channel_id,
	audit_log: process.env.audit_log,
};