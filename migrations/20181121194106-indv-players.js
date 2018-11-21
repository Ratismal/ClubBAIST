'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('TeeTimes', 'Player2', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Members',
        key: 'MemberID'
      }
    });
    await queryInterface.addColumn('TeeTimes', 'Player3', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Members',
        key: 'MemberID'
      }
    });
    await queryInterface.addColumn('TeeTimes', 'Player4', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Members',
        key: 'MemberID'
      }
    });
    await queryInterface.removeColumn('TeeTimes', 'PlayerCount');
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('TeeTimes', 'Player2');
    await queryInterface.removeColumn('TeeTimes', 'Player3');
    await queryInterface.removeColumn('TeeTimes', 'Player3');
    await queryInterface.addColumn('TeeTimes', 'PlayerCount', {
      type: Sequelize.INTEGER,
      validate: {
        min: 1,
        max: 4
      },
      allowNull: false
    });
  }
};
