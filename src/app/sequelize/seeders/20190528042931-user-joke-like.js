'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    
      return queryInterface.bulkInsert('UserJokeLikes', [
        {
        userId: 1,
        jokeId: 1
        },
        {
        userId: 2,
        jokeId: 1
        },
        {
        userId: 1,
        jokeId: 2
        },
        {
        userId: 2,
        jokeId: 3
        },
        {
        userId: 4,
        jokeId: 2
        },
        {
        userId: 3,
        jokeId: 1
        },
        {
        userId: 4,
        jokeId: 3
        },
        {
        userId: 3,
        jokeId: 2
        },
      ], {});
    
  },

  down: (queryInterface, Sequelize) => {
    
      return queryInterface.bulkDelete('UserJokeLikes', null, {});
  
  }
};
