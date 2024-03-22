const sequelize = require('../../db-connection');

const PokerGame = sequelize.define('PokerGame', {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.fn('gen_random_uuid'),
    primaryKey: true,
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
    defaultValue: Sequelize.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW,
  },
}, {
  timestamps: true,
  tableName: 'PokerGame',
});

// Optional: Add associations with other models here (e.g., User)

module.exports = PokerGame;
