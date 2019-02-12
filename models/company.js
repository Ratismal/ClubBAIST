'use strict';
module.exports = (sequelize, Sequelize) => {
  let Company = sequelize.define('Company', {
    CompanyID: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    CompanyName: {
      allowNull: false,
      type: Sequelize.TEXT
    },
    Address: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    PostalCode: {
      type: Sequelize.STRING(7),
      validate: {
        is: /^[A-Z]\d[A-Z] \d[A-Z]\d$/
      },
      allowNull: false
    },
    Phone: {
      type: Sequelize.STRING(12),
      validate: {
        is: /^\d{3}-\d{3}-\d{4}$/
      },
      allowNull: false
    }
  });


  Company.associate = function (models) {
    // associations can be defined here
  };
  return Company;
};
