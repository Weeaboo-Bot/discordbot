module.exports = (sequelize, DataTypes) => {
	return sequelize.define('game', {
		game_id: {
			type: DataTypes.STRING,
			primaryKey: true,
		},
        game_result: DataTypes.ENUM('win', 'lose', 'draw'),
		game_type: DataTypes.ENUM('blackjack', 'poker', 'roulette'),
	}, {
		timestamps: true,
	});
};