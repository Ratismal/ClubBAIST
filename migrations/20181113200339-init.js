'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('MembershipTiers', {
      TierType: {
        primaryKey: true,
        allowNull: false,
        type: Sequelize.INTEGER,
        autoIncrement: true
      },
      Name: {
        allowNull: false,
        type: Sequelize.TEXT
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

    console.log('Defining Companies');
    await queryInterface.createTable('Companies', {
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
        references: {
          model: 'Companies',
          key: 'CompanyID'
        },
        allowNull: true
      },
      MembershipTierType: {
        type: Sequelize.INTEGER,
        references: {
          model: 'MembershipTiers',
          key: 'TierType'
        },
        allowNull: false
      },
      Password: {
        type: Sequelize.TEXT,
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
      Player1ID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Members',
          key: 'MemberID'
        }
      },
      Player2ID: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Members',
          key: 'MemberID'
        }
      },
      Player3ID: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Members',
          key: 'MemberID'
        }
      },
      Player4ID: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Members',
          key: 'MemberID'
        }
      },
      CartCount: {
        type: Sequelize.INTEGER,
        validate: {
          min: 0,
          max: 4
        },
        allowNull: false
      },
      Timeslot: {
        type: Sequelize.DATE,
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

    await queryInterface.createTable('StandingTeeTimes', {
      StandingTeeTimeID: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
        autoIncrement: true
      },
      Player1ID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Members',
          key: 'MemberID'
        }
      },
      Player2ID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Members',
          key: 'MemberID'
        }
      },
      Player3ID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Members',
          key: 'MemberID'
        }
      },
      Player4ID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Members',
          key: 'MemberID'
        }
      },
      RequestedDay: {
        type: Sequelize.INTEGER,
        validate: {
          min: 0,
          max: 6
        },
        allowNull: false
      },
      RequestedTeeTime: {
        type: Sequelize.TIME,
        allowNull: false
      },
      RequestedStartDate: {
        type: Sequelize.DATE,
        allowNull: false
      },
      RequestedEndDate: {
        type: Sequelize.DATE,
        allowNull: false
      },
      ApprovedTeeTime: {
        type: Sequelize.TIME,
        allowNull: true
      },
      ApprovedDate: {
        type: Sequelize.TIME,
        allowNull: true
      },
      PriorityNumber: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      ApproverID: {
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
    await queryInterface.dropTable('TeeTimes');
    await queryInterface.dropTable('StandingTeeTimes');
    await queryInterface.dropTable('Members');
    await queryInterface.dropTable('Companies');
    await queryInterface.dropTable('MembershipTiers');
  }
};
