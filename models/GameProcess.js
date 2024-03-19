module.exports = (sequelize, DataTypes) => {
	return sequelize.define('game_process', {
        game_process_id: {
            type: DataTypes.STRING,
            unique: true,
            primaryKey: true,
            allowNull: false,
        },
		game_id: {
			type: DataTypes.STRING,
			primaryKey: false,
            allowNull: false,
            unique: 'game_process_game_id_user_id_unique',
            references: {
                model: 'game',
                key: 'game_id',
                deferrable: sequelize.Deferrable.INITIALLY_IMMEDIATE,
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            }
		},
        move: DataTypes.STRING,
		game_type: DataTypes.ENUM('blackjack', 'poker', 'roulette'),
	}, {
		timestamps: true,
	});
};