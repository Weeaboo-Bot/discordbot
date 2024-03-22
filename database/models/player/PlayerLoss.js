const sequelize = require('../../db-connection');
const { DataTypes } = require('sequelize');

const PlayerLoss = sequelize.define('PlayerLoss', {
  lossId: {
    type: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
    unique: true,
    defaultValue: sequelize.literal('uuid_generate_v4()'),
  },
  playerId: {
    type: DataTypes.UUID,
    defaultValue: null,
    references: {
      model: 'Player',
      key: 'id',
    },
  },
  gameType: {
    type: DataTypes.ENUM,
    values: ['blackjack', 'poker', 'slots', 'roulette'],
    allowNull: false,
  },
  betAmount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  lossAmount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
}, {
  timestamps: true,
  tableName: 'PlayerLoss',
});

PlayerLoss.associate = (models) => {
  // Define associations with other models (e.g., Player, Hand)
  // ...
  PlayerLoss.belongsTo(models.Player, { foreignKey: 'id' });
  // ...
};

module.exports = PlayerLoss;
