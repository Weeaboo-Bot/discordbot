const sequelize = require('../../db-connection');
const { DataTypes } = require('sequelize');

const BJHand = sequelize.define('BJHand', {
    id: {
        type: DataTypes.UUID,
        defaultValue: sequelize.fn('gen_random_uuid'),
        primaryKey: true,
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
    playerId: {
        type: DataTypes.STRING,
        defaultValue: null,
        references: {
            model: 'Player',
            key: 'id',
            as: 'playerId',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        },
    },
    cards: {
        type: DataTypes.JSON, // Store card data as an array of objects
        allowNull: false,
    },
    total: {
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
}, {
    timestamps: true,
    tableName: 'BJHand',
});

BJHand.associate = (models) => {
    // Define associations with other models (e.g., Player, Hand)
    // ...
    BJHand.belongsTo(models.BJGame, { foreignKey: 'id' });
    BJHand.belongsTo(models.Player, { foreignKey: 'id' });
    // ...
};

module.exports = BJHand;