'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    
      return queryInterface.bulkInsert('UserJokeFavorites', [
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
    ], {});
    
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('UserJokeFavorites', null, {});
  }
};
