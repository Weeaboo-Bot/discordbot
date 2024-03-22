const sequelize = require('../../db-connection');
const { DataTypes } = require('sequelize');
const RouletteBet = sequelize.define('RouletteBet', {
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
            model: 'RouletteGame',
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
    tableName: 'RouletteBet',
});

RouletteBet.associate = (models) => {
    // Define associations with other models (e.g., Player, Hand)
    // ...
    RouletteBet.belongsTo(models.RouletteGame, { foreignKey: 'id' });
    RouletteBet.belongsTo(models.Player, { foreignKey: 'id' });
    // ...
  };

// Optional: Add associations with other models here (e.g., User)

module.exports = RouletteBet;
