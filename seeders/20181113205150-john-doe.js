'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query('ALTER SEQUENCE "Members_MemberID_seq" RESTART WITH 1');

    await queryInterface.bulkInsert('Members', [{
      FirstName: 'John',
      LastName: 'Doe',
      Address: '123 Residence Lane',
      PostalCode: 'A1B2C3',
      Phone1: '123-456-7890',
      Email: 'jdoe@clubbaist.com',
      DateOfBirth: new Date(1980, 1, 1, 1, 1, 1),
      Tier: 'GOLD',
      createdAt: new Date(2018, 1, 1, 1, 1, 1),
      updatedAt: new Date(2018, 1, 1, 1, 1, 1)
    }, {
      FirstName: 'Jane',
      LastName: 'Doe',
      Address: '123 Residence Lane',
      PostalCode: 'A1B2C3',
      Phone1: '123-456-7890',
      Email: 'jdoe2@clubbaist.com',
      DateOfBirth: new Date(1980, 1, 1, 1, 1, 1),
      Tier: 'SILVER',
      createdAt: new Date(2018, 1, 1, 1, 1, 1),
      updatedAt: new Date(2018, 1, 1, 1, 1, 1)
    }, {
      FirstName: 'Jill',
      LastName: 'Daw',
      Address: '82 Residence Lane',
      PostalCode: 'A2B3C4',
      Phone1: '123-456-7890',
      Email: 'jdaw@clubbaist.com',
      DateOfBirth: new Date(1980, 1, 1, 1, 1, 1),
      Tier: 'SILVER',
      createdAt: new Date(2018, 1, 1, 1, 1, 1),
      updatedAt: new Date(2018, 1, 1, 1, 1, 1)
    }, {
      FirstName: 'Joel',
      LastName: 'Dip',
      Address: '21 Residence Lane',
      PostalCode: 'A3B4C5',
      Phone1: '123-456-7890',
      Email: 'jdip@clubbaist.com',
      DateOfBirth: new Date(1980, 1, 1, 1, 1, 1),
      Tier: 'BRONZE',
      createdAt: new Date(2018, 1, 1, 1, 1, 1),
      updatedAt: new Date(2018, 1, 1, 1, 1, 1)
    }], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('TeeTimes', null, {});
    await queryInterface.bulkDelete('Members', null, {});
    await queryInterface.sequelize.query('ALTER SEQUENCE "Members_MemberID_seq" RESTART WITH 1');
  }
};
