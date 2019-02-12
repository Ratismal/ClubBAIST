'use strict';
module.exports = (sequelize, Sequelize) => {
  const Member = sequelize.define('Member', {
    MemberID: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.INTEGER,
      autoIncrement: true
    },
    FirstName: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    LastName: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    Address: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    PostalCode: {
      type: Sequelize.TEXT,
      validate: {
        is: /^[A-Z]\d{3}$/
      }
    },
    Phone: {
      type: Sequelize.STRING(12),
      validate: {
        is: /^\d{3}-\d{3}-\d{4}$/
      },
      allowNull: false
    },
    Phone2: {
      type: Sequelize.STRING(12),
      validate: {
        is: /^\d{3}-\d{3}-\d{4}$/
      },
      allowNull: true
    },
    Email: {
      type: Sequelize.TEXT,
      validate: {
        isEmail: true
      },
      allowNull: false
    },
    DateOfBirth: {
      type: Sequelize.DATE,
      allowNull: false
    },
    Occupation: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    CompanyID: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    MembershipTierType: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    Password: {
      type: Sequelize.TEXT,
      allowNull: false
    }
  });
  Member.associate = function (models) {
    Member.belongsTo(models.Company, { foreignKey: 'CompanyID', targetKey: 'CompanyID' });
    Member.belongsTo(models.MembershipTier, { foreignKey: 'MembershipTierType', targetKey: 'TierType' });
    // Member.hasMany(models.TeeTime, { foreignKey: 'MemberID', source: 'MemberID' });
    // associations can be defined here
  };
  return Member;
};
