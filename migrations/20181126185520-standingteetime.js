'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('StandingTeeTimes', {
      MemberID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'Members',
          key: 'MemberID'
        }
      },
      DayOfWeek: {
        type: Sequelize.INTEGER,
        validate: {
          min: 1,
          max: 4
        },
        allowNull: false
      },
      Time: {
        type: Sequelize.TIME,
        allowNull: false,
        unique: true
      },
      StartDate: {
        type: Sequelize.DATE,
        allowNull: false,
        unique: true
      },
      EndDate: {
        type: Sequelize.DATE,
        allowNull: false,
        unique: true
      },
      Player2: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Members',
          key: 'MemberID'
        }
      },
      Player3: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Members',
          key: 'MemberID'
        }
      },
      Player4: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Members',
          key: 'MemberID'
        }
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
    await queryInterface.dropTable('StandingTeeTimes');

  }
};
