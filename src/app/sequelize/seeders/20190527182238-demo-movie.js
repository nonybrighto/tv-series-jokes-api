'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    
      return queryInterface.bulkInsert('Movies', [{
        name: 'himym',
        tmdbMovieId: 1,
        overview: 'The overview',
        posterPath: 'The poster Path',
        firstAirDate: '2003-10-10 02:00:00'
      }], {});
    
  },

  down: (queryInterface, Sequelize) => {
    
      return queryInterface.bulkDelete('Movies', null, {});
  
  }
};
