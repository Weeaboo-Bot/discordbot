const sequelize = require('../../db-connection');

const PokerGamePlayers = sequelize.define('PokerGamePlayers', {
    id: {
        type: DataTypes.UUID,
        defaultValue: sequelize.fn('gen_random_uuid'),
        primaryKey: true,
    },
    gameId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'PokerGame',
            key: 'id',
        },
    },
    playerId: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: 'Player',
            key: 'id',
        },
    },
    seatNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
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
    // Additional player-specific data for the game (e.g., stack size, buy-in)
}, {
    timestamps: true,
    tableName: 'PokerGamePlayers',
});

PokerGamePlayers.belongsTo(PokerGame, { foreignKey: 'gameId' });  // Define association with Game model
PokerGamePlayers.belongsTo(Player, { foreignKey: 'playerId' });  // Define association with Player model

module.exports = PokerGamePlayers;