'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    
      return queryInterface.bulkInsert('Jokes', [
        {
        text: 'The joke text',
         movieId: 1,
         ownerId: 2,
         imageUrl: 'http://crapUrl',
         createdAt: '2019-05-02 02:00:00',
         updatedAt: '2019-05-02 02:00:00',
        },
        {
        text: 'The joke text text',
         movieId: 2,
         ownerId: 1,
         likeCount:6,
         imageUrl: 'http://crapUrl',
         createdAt: '2019-05-03 02:00:00',
         updatedAt: '2019-05-03 02:00:00',
        },
        {
        text: 'The joke text text',
         movieId: 1,
         ownerId: 2,
         likeCount:3,
         imageUrl: 'http://crapUrl',
         createdAt: '2019-05-04 02:00:00',
         updatedAt: '2019-05-04 02:00:00',
        },
        {
        text: 'The joke text text',
         movieId: 1,
         ownerId: 1,
         likeCount:3,
         imageUrl: 'http://crapUrl',
         createdAt: '2019-05-04 02:00:00',
         updatedAt: '2019-05-04 02:00:00',
        },
        {
        text: 'The joke text text',
         movieId: 1,
         ownerId: 1,
         likeCount:3,
         imageUrl: 'http://crapUrl',
         createdAt: '2019-05-05 02:00:00',
         updatedAt: '2019-05-05 02:00:00',
        },
      ], {});
    
  },

  down: (queryInterface, Sequelize) => {
   
      return queryInterface.bulkDelete('Jokes', null, {});
  }
};
