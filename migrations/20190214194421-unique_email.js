'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    await queryInterface.changeColumn('Members', 'Email', {
      type: Sequelize.TEXT,
      validate: {
        isEmail: true
      },
      allowNull: false,
      unique: true
    }, {});
  },

  down: async (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    await queryInterface.changeColumn('Members', 'Email', {
      type: Sequelize.TEXT,
      validate: {
        isEmail: true
      },
      allowNull: false,
      unique: false
    }, {});
  }
};
