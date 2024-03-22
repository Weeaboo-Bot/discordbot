const sequelize = require('../../db-connection');
const { DataTypes } = require('sequelize');
const BJBet = sequelize.define('BJBet', {
    id: {
        type: DataTypes.UUID,
        defaultValue: sequelize.fn('gen_random_uuid'),
        primaryKey: true,
    },
    betAmount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    playerId: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: 'Player',
            key: 'id',
        },
    },
    gameId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'BJGame',
            key: 'id',
            as: 'gameId',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        },
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
}, {
    timestamps: true,
    tableName: 'BJBet',
});

BJBet.associate = (models) => {
    // Define associations with other models (e.g., Player, Hand)
    // ...
    BJBet.belongsTo(models.PokerGame, { foreignKey: 'id' });
    BJBet.belongsTo(models.Player, { foreignKey: 'id' });
    // ...
  };

// Optional: Add associations with other models here (e.g., User)

module.exports = BJBet;
