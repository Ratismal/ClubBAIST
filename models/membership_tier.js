'use strict';
module.exports = (sequelize, Sequelize) => {
  let MembershipTier = sequelize.define('MembershipTier', {
    TierType: {
        primaryKey: true,
        allowNull: false,
        type: Sequelize.INTEGER,
        autoIncrement: true
      },
      Name: {
        allowNull: false,
        type: Sequelize.TEXT
      }
  });


  MembershipTier.associate = function (models) {
    // associations can be defined here
  };
  return MembershipTier;
};
