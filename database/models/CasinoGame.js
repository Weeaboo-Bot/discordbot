const { DataTypes } = require('sequelize');

module.exports = () => {
  const CasinoGame = sequelize.define('CasinoGame', {
    gameId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      unique: true,
    },
    gameType: {
      type: DataTypes.ENUM,
      values: ['blackjack', 'poker', 'slots', 'roulette'],
      allowNull: false,
    },
  }, {
    // Additional model options if needed
  });

  // Define associations (optional)
  CasinoGame.associate = (models) => {
    // Define association here
  };

  return CasinoGame;
};
