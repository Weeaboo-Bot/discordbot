const sequelize = require('../../db-connection');
const { DataTypes } = require('sequelize');

  const PokerHand = sequelize.define('PokerHand', {
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
            as: 'gameId',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        },
    },
    playerId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'PokerGamePlayers',
        key: 'id',
        as: 'playerId',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }
    },
    cards: {
      type: DataTypes.JSON, // Store card data as an array of objects
      allowNull: false,
    },
    rank: {
      type: DataTypes.STRING, // Store the poker hand rank (e.g., "Full House", "Straight Flush")
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
    tableName: 'PokerHand',
});

  PokerHand.associate = (models) => {
    PokerHand.belongsTo(models.PokerGame, { foreignKey: 'id' });
    PokerHand.belongsTo(models.PokerGamePlayers, { foreignKey: 'id' });
  };

module.exports = PokerHand;