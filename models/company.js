'use strict';
module.exports = (sequelize, DataTypes) => {
  let Company = sequelize.define('Company', {
    CompanyName: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.STRING(25)
    },
    Address: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    PostalCode: {
      type: DataTypes.STRING(6),
      validate: {
        is: /^[A-Z]\d{3}$/
      },
      allowNull: false
    },
    Phone: {
      type: DataTypes.STRING(12),
      validate: {
        is: /^\d{3}-\d{3}-\d{4}$/
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


  Company.associate = function (models) {
    // associations can be defined here
  };
  return Company;
};
