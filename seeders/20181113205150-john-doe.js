'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query('ALTER SEQUENCE "Members_MemberID_seq" RESTART WITH 1');

    let date = new Date(2018, 1, 1, 1, 1, 1);

    await queryInterface.bulkInsert('MembershipTiers', [
      { Name: 'Gold', createdAt: date, updatedAt: date },
      { Name: 'Silver', createdAt: date, updatedAt: date },
      { Name: 'Bronze', createdAt: date, updatedAt: date },
      { Name: 'Copper', createdAt: date, updatedAt: date },
      { Name: 'Clerk', createdAt: date, updatedAt: date }
    ]);

    await queryInterface.bulkInsert('Members', [{
      FirstName: 'Gold',
      LastName: 'Member',
      Address: '123 Residence Lane',
      PostalCode: 'A1B2C3',
      Phone: '123-456-7890',
      Email: 'gm@clubbaist.com',
      DateOfBirth: new Date(1980, 1, 1, 1, 1, 1),
      MembershipTierType: 1,
      Password: 'password',
      createdAt: new Date(2018, 1, 1, 1, 1, 1),
      updatedAt: new Date(2018, 1, 1, 1, 1, 1)
    },
    {
      FirstName: 'Silver',
      LastName: 'Member',
      Address: '123 Residence Lane',
      PostalCode: 'A1B2C3',
      Phone: '123-456-7890',
      Email: 'sm@clubbaist.com',
      DateOfBirth: new Date(1980, 1, 1, 1, 1, 1),
      MembershipTierType: 2,
      Password: 'password',
      createdAt: new Date(2018, 1, 1, 1, 1, 1),
      updatedAt: new Date(2018, 1, 1, 1, 1, 1)
    },
    {
      FirstName: 'Bronze',
      LastName: 'Member',
      Address: '123 Residence Lane',
      PostalCode: 'A1B2C3',
      Phone: '123-456-7890',
      Email: 'bm@clubbaist.com',
      DateOfBirth: new Date(1980, 1, 1, 1, 1, 1),
      MembershipTierType: 3,
      Password: 'password',
      createdAt: new Date(2018, 1, 1, 1, 1, 1),
      updatedAt: new Date(2018, 1, 1, 1, 1, 1)
    },
    {
      FirstName: 'Copper',
      LastName: 'Member',
      Address: '123 Residence Lane',
      PostalCode: 'A1B2C3',
      Phone: '123-456-7890',
      Email: 'cm@clubbaist.com',
      DateOfBirth: new Date(1980, 1, 1, 1, 1, 1),
      MembershipTierType: 4,
      Password: 'password',
      createdAt: new Date(2018, 1, 1, 1, 1, 1),
      updatedAt: new Date(2018, 1, 1, 1, 1, 1)
    },
    {
      FirstName: 'Clerk',
      LastName: 'Clerk',
      Address: '123 Residence Lane',
      PostalCode: 'A1B2C3',
      Phone: '123-456-7890',
      Email: 'sm@clubbaist.com',
      DateOfBirth: new Date(1980, 1, 1, 1, 1, 1),
      MembershipTierType: 5,
      Password: 'password',
      createdAt: new Date(2018, 1, 1, 1, 1, 1),
      updatedAt: new Date(2018, 1, 1, 1, 1, 1)
    }], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('TeeTimes', null, {});
    await queryInterface.bulkDelete('Members', null, {});
    await queryInterface.bulkDelete('MembershipTiers', null, {});
    await queryInterface.sequelize.query('ALTER SEQUENCE "Members_MemberID_seq" RESTART WITH 1');
    await queryInterface.sequelize.query('ALTER SEQUENCE "MembershipTiers_TierType_seq" RESTART WITH 1');
    await queryInterface.sequelize.query('ALTER SEQUENCE "TeeTimes_TeeTimeID_seq" RESTART WITH 1');
  }
};
