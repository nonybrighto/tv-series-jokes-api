'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('UserMovieFollows', [
      {
        userId: 1,
        movieId: 1
      },
      {
        userId: 1,
        movieId: 2
      },
      {
        userId: 1,
        movieId: 3
      },
      {
        userId: 2,
        movieId: 1
      },
      {
        userId: 2,
        movieId: 2
      },
      {
        userId: 3,
        movieId: 1
      }
], {});
  },

  down: (queryInterface, Sequelize) => {
   
      return queryInterface.bulkDelete('UserMovieFollows', null, {});
  }
};
