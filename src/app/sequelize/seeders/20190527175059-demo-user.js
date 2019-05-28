'use strict';

const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    
     
    let users = [{
      username: 'nony',
      email: 'nony@gmail.com',
      password: 'thepassword',
      profilePhoto: 'myPhotolinkhere'
    }].map(async (user)=>{
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
