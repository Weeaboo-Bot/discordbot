module.exports = (sequelize, DataTypes) => {
	return sequelize.define('player_win', {
        player_win_id: {
            type: DataTypes.STRING,
            unique: true,
            primaryKey: true,
            allowNull: false,
        },
		user_id: {
			type: DataTypes.STRING,
			primaryKey: false,
            allowNull: false,
            unique: 'player_win_player_win_id_user_id_unique',
            references: {
                model: 'player',
                key: 'user_id',
                deferrable: sequelize.Deferrable.INITIALLY_IMMEDIATE,
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            }
		},
        move: DataTypes.STRING,
		game_type: DataTypes.ENUM('blackjack', 'poker', 'roulette'),
        bet_amount: {
            type: DataTypes.INTEGER,
            allowNull: false,
            default: 0,
        },
        win_amount: {
            type: DataTypes.INTEGER,
            allowNull: false,
            default: 0,
        },
	}, {
		timestamps: true,
	});
};