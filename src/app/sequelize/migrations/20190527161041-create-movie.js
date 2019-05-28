'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Movies', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      tmdbMovieId: {
        type: Sequelize.INTEGER
      },
      overview: {
        type: Sequelize.TEXT
      },
      posterPath: {
        type: Sequelize.STRING
      },
      jokeCount: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      firstAirDate: {
        type: Sequelize.DATE
      },
      followerCount: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Movies');
  }
};