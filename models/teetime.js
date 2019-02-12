'use strict';
module.exports = (sequelize, Sequelize) => {
  const TeeTime = sequelize.define('TeeTime', {
    TeeTimeID: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.INTEGER,
      autoIncrement: true
    },
    Player1ID: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    Player2ID: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    Player3ID: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    Player4ID: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    CartCount: {
      type: Sequelize.INTEGER,
      validate: {
        min: 0,
        max: 4
      },
      allowNull: false
    },
    Timeslot: {
      type: Sequelize.DATE,
      allowNull: false
    }
  });
  TeeTime.associate = function (models) {
    TeeTime.belongsTo(models.Member, { foreignKey: 'Player1ID', targetKey: 'MemberID', as: 'Player1' });
    TeeTime.belongsTo(models.Member, { foreignKey: 'Player2ID', targetKey: 'MemberID', as: 'Player2' });
    TeeTime.belongsTo(models.Member, { foreignKey: 'Player3ID', targetKey: 'MemberID', as: 'Player3' });
    TeeTime.belongsTo(models.Member, { foreignKey: 'Player4ID', targetKey: 'MemberID', as: 'Player4' });
    // associations can be defined here
  };
  return TeeTime;
};
