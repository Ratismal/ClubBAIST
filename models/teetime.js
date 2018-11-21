'use strict';
module.exports = (sequelize, DataTypes) => {
  const TeeTime = sequelize.define('TeeTime', {
    TeeTimeID: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER,
      autoIncrement: true
    },
    CartCount: {
      type: DataTypes.INTEGER,
      validate: {
        min: 1,
        max: 4
      },
      allowNull: false
    },
    Date: {
      type: DataTypes.DATE,
      allowNull: false,
      unique: true
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  });
  TeeTime.associate = function (models) {
    TeeTime.belongsTo(models.Member, { foreignKey: 'MemberID', targetKey: 'MemberID', as: 'P1' });
    TeeTime.belongsTo(models.Member, { foreignKey: 'Player2', targetKey: 'MemberID', as: 'P2' });
    TeeTime.belongsTo(models.Member, { foreignKey: 'Player3', targetKey: 'MemberID', as: 'P3' });
    TeeTime.belongsTo(models.Member, { foreignKey: 'Player4', targetKey: 'MemberID', as: 'P4' });
    // associations can be defined here
  };
  return TeeTime;
};
