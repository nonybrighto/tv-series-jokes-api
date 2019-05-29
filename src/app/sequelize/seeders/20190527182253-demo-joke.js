'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    
      return queryInterface.bulkInsert('Jokes', [
        {
        title: 'first joke',
        text: 'The joke text',
         movieId: 1,
         ownerId: 1,
         imageUrl: 'http://crapUrl',
         createdAt: '2019-05-02 02:00:00',
         updatedAt: '2019-05-02 02:00:00',
        },
        {
        title: 'second joke',
        text: 'The joke text text',
         movieId: 1,
         ownerId: 1,
         likeCount:6,
         imageUrl: 'http://crapUrl',
         createdAt: '2019-05-03 02:00:00',
         updatedAt: '2019-05-03 02:00:00',
        },
        {
        title: 'third joke',
        text: 'The joke text text',
         movieId: 1,
         ownerId: 1,
         likeCount:3,
         imageUrl: 'http://crapUrl',
         createdAt: '2019-05-04 02:00:00',
         updatedAt: '2019-05-04 02:00:00',
        },
        {
        title: 'fought joke - lol',
        text: 'The joke text text',
         movieId: 1,
         ownerId: 1,
         likeCount:3,
         imageUrl: 'http://crapUrl',
         createdAt: '2019-05-04 02:00:00',
         updatedAt: '2019-05-04 02:00:00',
        },
        {
        title: 'feet joke - boring',
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
