'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Comments', [
      {
        content: 'This is a first 1 comment by user 1',
        jokeId: 1,
        createdAt: '2019-05-02 02:00:00',
         updatedAt: '2019-05-02 02:00:00',
         ownerId: 1,
        },
        {
          content: 'This is a first 2 comment by user 1',
          jokeId: 2,
          createdAt: '2019-05-02 02:00:00',
          updatedAt: '2019-05-02 02:00:00',
          anonymousName: 'ross'
        },
        {
          content: 'This is a second 1 comment by user 1',
          jokeId: 1,
          createdAt: '2019-05-02 02:00:00',
          updatedAt: '2019-05-02 02:00:00',
          anonymousName: 'joey'
      },
      {
        content: 'This is a first 1 comment by user 2',
        jokeId: 1,
        createdAt: '2019-05-02 02:00:00',
         updatedAt: '2019-05-02 02:00:00',
         ownerId: 1
      },
      {
        content: 'This is a first 1 comment by anonymous',
        jokeId: 1,
        createdAt: '2019-05-02 02:00:00',
         updatedAt: '2019-05-02 02:00:00',
         ownerId: 2
      },
      {
        content: 'This is a first 1 comment by another anonymous',
        jokeId: 1,
        createdAt: '2019-05-02 02:00:00',
         updatedAt: '2019-05-02 02:00:00',
         ownerId: 1
      },
     
], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Comments', null, {});
  }
};
