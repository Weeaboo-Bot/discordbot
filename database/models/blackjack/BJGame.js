const sequelize = require('../../db-connection');

const BJGame = sequelize.define('BJGame', {
  id: {
    type: DataTypes.UUID,
    defaultValue: sequelize.fn('gen_random_uuid'),
    primaryKey: true,
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
  data: {
    type: DataTypes.JSON,
    allowNull: false,
  },
}, {
  timestamps: true,
  tableName: 'BJGame',
});

// Optional: Add associations with other models here (e.g., User)

module.exports = BJGame;
