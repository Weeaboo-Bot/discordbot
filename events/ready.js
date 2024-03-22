const { version } = require('../package.json');
const { formatNumber } = require('../util/Util');
const { readyMessage } = require('../util/logHandler');
const { Player, BJGame, PokerGame, RouletteGame, BJGameLog, RouletteGameLog, PokerGameLog, CasinoGame } = require('../database/models/index');
// Export ready events
module.exports = async (client) => {
    client.database.sync();
    async function fetchAndCacheData() {
        try {
            const [casinoUsers, casinoGames, casinoGameLogs, casinoGameMapping] = await Promise.all([
                Player.findAll(),
                Promise.all([BJGame.findAll(), PokerGame.findAll(), RouletteGame.findAll()]),
                Promise.all([BJGameLog.findAll(), PokerGameLog.findAll(), RouletteGameLog.findAll()]),
                CasinoGame.findAll(),
            ]);

            const flattenedCasinoGames = casinoGames.flat();
            const flattenedCasinoGameLogs = casinoGameLogs.flat();
            cacheData(casinoUsers, client.casinoUsers, 'id');
            cacheData(flattenedCasinoGames, client.casinoGames, 'id');
            cacheData(flattenedCasinoGameLogs, client.casinoGameLog, 'id');
            cacheData(casinoGameMapping, client.casinoMapping, 'id');
            client.logger.info('Reloaded DB and Cache');
        } catch (error) {
            client.logger.error('Error fetching and caching data:', error);
        }
    }

    function cacheData(items, cacheMap, keyProperty) {
        items.forEach((item) => cacheMap.set(item[keyProperty], item.dataValues));
    }
    await fetchAndCacheData();
    // Push client-related activities
    client.activities.push(
        {
            text: () => `${formatNumber(client.guilds.cache.size)} servers`,
            type: 'WATCHING',
        },
        {
            text: () =>
                `with ${formatNumber(client.registry.commands.size)} commands`,
            type: 'PLAYING',
        },
        {
            text: () => `${formatNumber(client.channels.cache.size)} channels`,
            type: 'WATCHING',
        }
    );

    // Interval to change activity every minute
    client.setInterval(() => {
        const activity =
            client.activities[
            Math.floor(Math.random() * client.activities.length)
            ];
        const text =
            typeof activity.text === 'function'
                ? activity.text()
                : activity.text;
        client.user.setActivity(text, { type: activity.type });
    }, 60000);

    client.logger.info(
        `[READY] Logged in as ${client.user.tag}! ID: ${client.user.id}`
    );
    client.logger.info(
        `${client.user.tag} is running on ${client.guilds.cache.size} server(s)`
    );
    const embed = readyMessage({
        client,
        version
    });
    client.botLogger(embed);
};
