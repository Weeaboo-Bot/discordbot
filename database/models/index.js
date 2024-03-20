const Player = require('./Player');
const PlayerWin = require('./PlayerWin');
const PlayerLoss = require('./PlayerLoss');
const CasinoGame = require('./CasinoGame');
const CasinoGameLog = require('./CasinoGameLog');

// Define any associations here (optional)
CasinoGameLog.associate = (models) => {
  CasinoGameLog.belongsTo(models.Player, {
    foreignKey: 'userId',
  });
  CasinoGameLog.belongsTo(models.CasinoGame, {
    foreignKey: 'casinoGameId',
  });
  // ... other associations here (optional)
};

module.exports = {
  Player,
  PlayerWin,
  PlayerLoss,
  CasinoGame,
  CasinoGameLog,
  // ... other models
};
