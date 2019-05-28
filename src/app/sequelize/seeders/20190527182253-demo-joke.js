'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    
      return queryInterface.bulkInsert('Jokes', [
        {
        title: 'first joke',
        text: 'The joke text',
         movieId: 1,
         ownerId: 1,
         imageUrl: 'http://crapUrl'
        },
        {
        title: 'second joke',
        text: 'The joke text text',
         movieId: 1,
         ownerId: 1,
         likeCount:6,
         imageUrl: 'http://crapUrl'
        },
        {
        title: 'second joke',
        text: 'The joke text text',
         movieId: 1,
         ownerId: 1,
         likeCount:3,
         imageUrl: 'http://crapUrl'
        },
      ], {});
    
  },

  down: (queryInterface, Sequelize) => {
   
      return queryInterface.bulkDelete('Jokes', null, {});
  }
};
