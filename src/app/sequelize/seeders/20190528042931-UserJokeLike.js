'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    
      return queryInterface.bulkInsert('UserJokeLikes', [
        {
        userId: 1,
        jokeId: 1
        },
        {
        userId: 1,
        jokeId: 2
        }
      ], {});
    
  },

  down: (queryInterface, Sequelize) => {
    
      return queryInterface.bulkDelete('UserJokeLikes', null, {});
  
  }
};
