'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    console.log('Defining Companies');
    await queryInterface.createTable('Companies', {
      CompanyName: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(25)
      },
      Address: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      PostalCode: {
        type: Sequelize.STRING(6),
        validate: {
          is: /^[A-Z]\d{3}$/
        },
        allowNull: false
      },
      Phone: {
        type: Sequelize.STRING(12),
        validate: {
          is: /^\d{3}-\d{3}-\d{4}$/
        },
        allowNull: false
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

    console.log('Defining Members');
    await queryInterface.createTable('Members', {
      MemberID: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
        autoIncrement: true
      },
      FirstName: {
        type: Sequelize.STRING(25),
        allowNull: false
      },
      LastName: {
        type: Sequelize.STRING(25),
        allowNull: false
      },
      Address: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      PostalCode: {
        type: Sequelize.STRING(6),
        validate: {
          is: /^[A-Z]\d{3}$/
        }
      },
      Phone1: {
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
        allowNull: false
      },
      Email: {
        type: Sequelize.STRING(50),
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
        type: Sequelize.STRING(25),
        allowNull: true
      },
      CompanyName: {
        type: Sequelize.STRING(25),
        references: {
          model: 'Companies',
          key: 'CompanyName'
        },
        allowNull: true
      },
      Tier: {
        type: Sequelize.ENUM('GOLD', 'SILVER', 'BRONZE', 'COPPER'),
        allowNull: false
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

    console.log('Defining TeeTimes');
    await queryInterface.createTable('TeeTimes', {
      TeeTimeID: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
        autoIncrement: true
      },
      MemberID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Members',
          key: 'MemberID'
        }
      },
      PlayerCount: {
        type: Sequelize.INTEGER,
        validate: {
          min: 1,
          max: 4
        },
        allowNull: false
      },
      CartCount: {
        type: Sequelize.INTEGER,
        validate: {
          min: 1,
          max: 4
        },
        allowNull: false
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
    await queryInterface.dropTable('TeeTimes');
    await queryInterface.dropTable('Memebrs');
    await queryInterface.dropTable('Companies');
  }
};
