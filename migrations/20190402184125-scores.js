'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('PlayerScores', {
      MemberID: {
        primaryKey: true,
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Members',
          key: 'MemberID'
        }
      },
      Date: {
        primaryKey: true,
        allowNull: false,
        type: Sequelize.DATE
      },
      Handicap: {
        allowNull: false,
        type: Sequelize.DOUBLE
      },
      TotalScore: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Scores');
  }
};
