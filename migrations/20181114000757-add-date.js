'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('TeeTimes', 'Date', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    });

    await queryInterface.changeColumn('TeeTimes', 'Date', {
      type: Sequelize.DATE,
      allowNull: false
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('TeeTimes', 'Date');
  }
};
