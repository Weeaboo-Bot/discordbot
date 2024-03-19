const Sequelize = require('sequelize');
const dbConnection = require('./db-connection');
const sequelize = await dbConnection(require('../../config').database);

const Players = require('./models/Player')(sequelize, Sequelize.DataTypes);
require('./models/PlayerLoss')(sequelize, Sequelize.DataTypes);
require('./models/PlayerWin')(sequelize, Sequelize.DataTypes);

const force = process.argv.includes('--force') || process.argv.includes('-f');

sequelize.sync({ force }).then(async () => {
	const players = [
        Players.upsert({ id: '1', user_name: 'test_user', user_tag: 'test_user', bot: false, balance: 0}),
        Players.upsert({ id: '2', user_name: 'test_bot', user_tag: 'test_bot', bot: true, balance: 0}) ,
	];

	await Promise.all(players);
	console.log('Database synced');

	sequelize.close();
}).catch(console.error);