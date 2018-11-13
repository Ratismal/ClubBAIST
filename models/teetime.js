'use strict';
module.exports = (sequelize, DataTypes) => {
  const TeeTime = sequelize.define('TeeTime', {
    TeeTimeID: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER,
      autoIncrement: true
    },
    PlayerCount: {
      type: DataTypes.INTEGER,
      validate: {
        min: 1,
        max: 4
      },
      allowNull: false
    },
    CartCount: {
      type: DataTypes.INTEGER,
      validate: {
        min: 1,
        max: 4
      },
      allowNull: false
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
    TeeTime.belongsTo(models.Member, { foreignKey: 'MemberID', targetKey: 'MemberID' });
    // associations can be defined here
  };
  return TeeTime;
};
