'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('UserFriendFollows', [
      {
        followerId: 1,
        followingId: 2
      },
      {
        followerId: 1,
        followingId: 3
      },
      {
        followerId: 1,
        followingId: 4
      },
      {
        followerId: 2,
        followingId: 3
      },
      {
        followerId: 2,
        followingId: 4
      }
], {});
  },

  down: (queryInterface, Sequelize) => {
   
      return queryInterface.bulkDelete('UserFriendFollows', null, {});
  }
};
