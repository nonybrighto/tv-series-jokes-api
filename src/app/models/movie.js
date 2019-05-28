'use strict';
module.exports = (sequelize, DataTypes) => {
  const Movie = sequelize.define('Movie', {
    name: {
      type: DataTypes.STRING
    },
    tmdbMovieId: {
      type: DataTypes.INTEGER
    },
    overview: {
      type: DataTypes.TEXT
    },
    posterPath: {
      type: DataTypes.STRING
    },
    jokeCount: {
      type: DataTypes.INTEGER
    },
    firstAirDate: {
      type: DataTypes.DATE
    },
    followerCount: {
      type: DataTypes.INTEGER
    },
  }, {});
  Movie.associate = function(models) {
    // associations can be defined here
    Movie.hasMany(models.Joke, {
      foreignKey: 'movieId',
      as: 'Jokes'
    });
  };
  return Movie;
};