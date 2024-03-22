const sequelize = require('../../db-connection');

const PokerGame = sequelize.define('PokerGame', {
  id: {
    type: DataTypes.UUID,
    defaultValue: sequelize.fn('gen_random_uuid'),
    primaryKey: true,
  },
  data: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  tableName: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  maxPlayers: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  blindLevel: {
    type: DataTypes.INTEGER,
    allowNull: true,
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
  tableName: 'PokerGame',
});

// Optional: Add associations with other models here (e.g., User)

module.exports = PokerGame;
