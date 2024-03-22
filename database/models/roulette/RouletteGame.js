const sequelize = require('../../db-connection');

  const RouletteGame = sequelize.define('RouletteGame', {
    id: {
      type: DataTypes.UUID,
      defaultValue: sequelize.fn('gen_random_uuid'),
      primaryKey: true,
    },
    data: {
      type: DataTypes.JSON,
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
  });

  // Optional: Add associations with other models here (e.g., User)

module.exports = RouletteGame;