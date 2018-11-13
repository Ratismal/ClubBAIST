'use strict';
module.exports = (sequelize, DataTypes) => {
  const Member = sequelize.define('Member', {
    MemberID: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER,
      autoIncrement: true
    },
    FirstName: {
      type: DataTypes.STRING(25),
      allowNull: false
    },
    LastName: {
      type: DataTypes.STRING(25),
      allowNull: false
    },
    Address: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    PostalCode: {
      type: DataTypes.STRING(6),
      validate: {
        is: /^[A-Z]\d{3}$/
      }
    },
    Phone1: {
      type: DataTypes.STRING(12),
      validate: {
        is: /^\d{3}-\d{3}-\d{4}$/
      },
      allowNull: false
    },
    Phone2: {
      type: DataTypes.STRING(12),
      validate: {
        is: /^\d{3}-\d{3}-\d{4}$/
      },
      allowNull: false
    },
    Email: {
      type: DataTypes.STRING(50),
      validate: {
        isEmail: true
      },
      allowNull: false
    },
    DateOfBirth: {
      type: DataTypes.DATE,
      allowNull: false
    },
    Occupation: DataTypes.STRING(25),
    Tier: {
      type: DataTypes.ENUM('GOLD', 'SILVER', 'BRONZE', 'COPPER'),
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
  Member.associate = function (models) {
    Member.belongsTo(models.Company, { foreignKey: 'CompanyName', targetKey: 'CompanyName' });
    Member.hasMany(models.TeeTime, { foreignKey: 'MemberID', source: 'MemberID' });
    // associations can be defined here
  };
  return Member;
};
