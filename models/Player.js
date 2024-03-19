module.exports = (sequelize, DataTypes) => {
	return sequelize.define('players', {
		user_id: {
			type: DataTypes.STRING,
			primaryKey: true,
            unique: true,
            allowNull: false,
		},
        user_name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        user_tag: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        bot: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        },
		balance: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
			allowNull: false,
		},
	}, {
		timestamps: true,
	});
};