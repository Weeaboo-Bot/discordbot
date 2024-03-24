const { version } = require('../package.json');
const { formatNumber } = require('../util/Util');
const { readyMessage } = require('../util/logHandler');
const { Player, BJGame, PokerGame, RouletteGame, BJGameLog, RouletteGameLog, PokerGameLog, CasinoGame } = require('../database/models/index');
// Export ready events
module.exports = async (client) => {
    client.database.sync({ logging: false });
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
            client.logger.info('[DATABASE CACHE] Reloaded DB and Cache');
        } catch (error) {
            client.logger.error('Error fetching and caching data:', error);
        }
    }

    function cacheData(items, cacheMap, keyProperty) {
        items.forEach((item) => cacheMap.set(item[keyProperty], item.dataValues));
    }
    await fetchAndCacheData();
    client.user.setActivity('Running Bot', { type: 'PLAYING' });
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
