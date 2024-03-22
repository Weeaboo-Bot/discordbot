const sequelize = require('../../db-connection');
const { DataTypes } = require('sequelize');

const CasinoGame = sequelize.define('CasinoGame', {
    id: {
        type: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
        unique: true,
        defaultValue: sequelize.literal('uuid_generate_v4()'),
    },
    gameType: {
        type: DataTypes.ENUM,
        values: ['blackjack', 'poker', 'slots', 'roulette'],
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
}, {
    timestamps: true,
    tableName: 'CasinoGame',
});


module.exports = CasinoGame;
