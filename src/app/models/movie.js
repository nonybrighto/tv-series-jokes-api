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

  Movie.getMovies = async function({movieId, currentUserId, limit, offset}){

    let movieFollowedSelectString = '';
    let movieFollowedJoinString = '';
    let currentUserReplacementObject = {};
    let whereString = '';
    let limitOffsetString = '';
    let limitOffsetObject = {};

    if(currentUserId){
        movieFollowedSelectString = ', mvf."userId" IS NOT NULL as "followed" ';
        movieFollowedJoinString  = ` LEFT OUTER JOIN
        "UserMovieFollows" as mvf
        ON
        movie.id = mvf."movieId" AND mvf."userId" = :userId`;
        currentUserReplacementObject = {userId: currentUserId};
    }

    if(movieId){
        whereString = ' WHERE movie.id = :movieId '
    }else{
      limitOffsetString = ` LIMIT :limit OFFSET :offset `;
      limitOffsetObject = {limit: limit, offset: offset};
    }
       
    return sequelize.query(`SELECT movie.* ${movieFollowedSelectString}
                            FROM 
                            "Movies" as movie
                            ${movieFollowedJoinString}
                            ${whereString}
                            ${limitOffsetString}
                            `,                             
                          { 
                            nest: true,
                            model: sequelize.models.Movie,
                            replacements: { movieId:movieId, ...currentUserReplacementObject, ...limitOffsetObject},
                            type: sequelize.QueryTypes.SELECT
                          });
}


Movie.getMovie = async function({movieId, currentUserId}){

    let movie = await Movie.getMovies({movieId: movieId, currentUserId: currentUserId});
    return (movie.length > 0)? movie[0] : null;
}
  return Movie;
};