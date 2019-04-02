'use strict';
module.exports = (sequelize, Sequelize) => {
  const Score = sequelize.define('PlayerScore', {
    MemberID: {
      primaryKey: true,
      allowNull: false,
      type: Sequelize.INTEGER
    },
    Date: {
      primaryKey: true,
      allowNull: false,
      type: Sequelize.DATEONLY
    },
    Handicap: {
      allowNull: false,
      type: Sequelize.DOUBLE
    },
    TotalScore: {
      allowNull: false,
      type: Sequelize.INTEGER
    }
  });
  Score.associate = function (models) {
    Score.belongsTo(models.Member, { foreignKey: 'MemberID', targetKey: 'MemberID' });
  };
  return Score;
};
