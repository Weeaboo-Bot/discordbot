const dotenv = require('dotenv');
dotenv.config();
module.exports = {
	/* The token of your Discord Bot */
	token: process.env.token,
	prefix: process.env.prefix,
	email: process.env.email,
	password: process.env.password,
	color: '#9f0db5',
	/* For the support server */
	support: {
		id: process.env.guild_id, // The ID of the support server
		audit_log: process.env.audit_log,
		error_log: process.env.error_log,
		status_log: process.env.status_log,
		dm_log: process.env.dm_log,
		bot_client_id: process.env.client_id,
		server_id: process.env.server_id,
		bot_log: process.env.bot_log,
		event_log: process.env.event_log,
		guild_log: process.env.guild_log,
		logs: "XXXXXXXXXXX", // And the ID of the logs channel of your server (new servers for example)
	},
	db_pass: process.env.db_pass,
	db_name: process.env.db_name,
	mongoDB: `mongodb+srv://dbuser:qadAC5OMGUTlEcFz>@discordcluster.3zyjj.gcp.mongodb.net/discord-bots?retryWrites=true&w=majority`, // The URl of the mongodb database
	prefix: "*", // The default prefix for the bot
	/* For the embeds (embeded messages) */
	embed: {
		color: "#0091fc", // The default color for the embeds
		footer: "Atlanta | Open Source" // And the default footer for the embeds
	},
	/* Bot's owner informations */
	owner: {
		id: process.env.discord_owner_id, // The ID of the bot's owner
		disc: process.env.owner_disc,
		name: process.env.owner_name // And the name of the bot's owner
	},
	/* The API keys that are required for certain commands */
	apiKeys: {
		google_token: process.env.google_token,
		google_cse_key: process.env.google_cse_key,
		webhook_id: process.env.webhook_id,
		webhook_token: process.env.webhook_token,
		webhook_url: process.env.webhook_url,
		new_relic_key: process.env.NEW_RELIC_LICENSE_KEY,
		new_relic_log: process.env.NEW_RELIC_LOG,
		papertrail_key: process.env.PAPERTRAIL_API_TOKEN,
		genius_token: process.env.genius_token,
		giphy_key: process.env.giphy_key,
		news_token: process.env.news_token,
		osu_key: process.env.osu_key,
		tenor_token: process.env.tenor_token,
		weather_token: process.env.weather_token
	},
	/* The others utils links */
	others: {
		github: "https://github.com/sdoran35", // Founder's github account
	},
	/* The Bot status */
	status: [
		{
			name: "@Weaboo Bot help on {serversCount} servers",
			type: "LISTENING"
		},
	],
	/* Language configuration */
	languages: [
		{
			name: "en-US",
			nativeName: "English",
			moment: "en",
			defaultMomentFormat: "MMMM Do YYYY",
			default: true,
			aliases: [
				"English",
				"en",
				"en-us",
				"en_us",
				"en_US"
			]
		},
		{
			name: "fr-FR",
			nativeName: "Français",
			defaultMomentFormat: "Do MMMM YYYY",
			moment: "fr",
			default: false,
			aliases: [
				"French",
				"français",
				"francais",
				"fr",
				"fr_fr"
			]
		},
		{
			name: "es-ES",
			nativeName: "Español",
			defaultMomentFormat: "MMM Do, YYYY",
			moment: "es",
			default: false,
			aliases: [
				"Spanish",
				"es",
				"es_es"
			]
		},
		{
			name: "it-IT",
			nativeName: "Italiano",
			defaultMomentFormat: "Do MMMM YYYY",
			moment: "it",
			default: false,
			aliases: [
				"Italian",
				"it",
				"it_it"
			]
		},
		{
			name: "nl-NL",
			nativeName: "Nederlands",
			defaultMomentFormat: "Do MMMM YYYY",
			moment: "nl",
			default: false,
			aliases: [
				"Dutch",
				"nl",
				"nl_nl"
			]
		},
		{
			name: "pt-PT",
			nativeName: "Português",
			defaultMomentFormat: "Do MMMM YYYY",
			moment: "pt",
			default: false,
			aliases: [
				"Portuguese",
				"pt",
				"pt_pt"
			]
		}
	]
};
