'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Members', [{
      MemberID: 0,
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
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Members', null, {});
  }
};
