'use strict';

const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    
     
    let users = [
      {
        username: 'nony',
        email: 'nony@gmail.com',
        password: 'thepassword',
        profilePhoto: 'myPhotolinkhere',
        createdAt: '2019-01-01 02:00:00',
        updatedAt: '2019-01-01 02:00:00',
      },
      {
        username: 'nonybright',
        email: 'nonybright@gmail.com',
        password: 'thepassword',
        profilePhoto: 'myPhotolinkhere',
        createdAt: '2019-02-01 02:00:00',
        updatedAt: '2019-02-01 02:00:00',
      },
      {
        username: 'ada',
        email: 'ada@gmail.com',
        password: 'thepassword',
        profilePhoto: 'myPhotolinkhere',
        createdAt: '2019-03-03 02:00:00',
        updatedAt: '2019-03-03 02:00:00',
      },
      {
        username: 'lalaperry',
        email: 'lalaperry@gmail.com',
        password: 'thepassword',
        profilePhoto: 'myPhotolinkhere',
        createdAt: '2019-04-04 02:00:00',
        updatedAt: '2019-04-04 02:00:00',
      }
    ].map(async (user)=>{
      let passwordHash = await bcrypt.hash(user.password, 10);
        let pwd = {password: passwordHash};
        return {...user, ...pwd};
    });

    let allUsers = await Promise.all(users);
    return queryInterface.bulkInsert('Users',  await allUsers , {});
  },

  down: (queryInterface, Sequelize) => {
    
      return queryInterface.bulkDelete('Users', null, {});
    
  }
};
