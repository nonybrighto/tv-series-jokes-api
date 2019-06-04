'use strict';

module.exports = (sequelize, DataTypes) =>{
  console.log(sequelize.models);
  const Joke = sequelize.define('Joke', {
    title: {
      type: DataTypes.STRING
    },
    text: {
      type: DataTypes.TEXT
    },
    commentCount: {
      type: DataTypes.INTEGER
    },
    likeCount: {
      type: DataTypes.INTEGER
    },
    movieId: {
      type: DataTypes.INTEGER
    },
    ownerId: {
      type: DataTypes.INTEGER
    },
    imageUrl: {
      type: DataTypes.STRING
    },
  }, {
    scopes: {
        withAssociations: {
          include: [
           { association: 'owner' },
           { association: 'movie' , attributes: {
            exclude: ['overview']
          }},
          ]
        },
        popular: {
          order: sequelize.literal('likeCount DESC')
        }
    }
  });

  Joke.getJokes = async function({currentUserId = null, popular = false, movieId, offset = 0, limit = 200}){

    let likeFavSelectString = '';
    let likeFavJoinString = '';
    let orderString = '';
    let currentUserReplacementObject = {};
    let whereString = '';
    let whereObject = {};

    if(movieId){
      whereString = ` WHERE joke."movieId" = :movieId `;
      whereObject = {movieId: movieId};
    }

    if(currentUserId){
      likeFavSelectString = ` jokeLike."userId" IS NOT NULL as  liked,
      jokeFav."userId" IS NOT NULL as  favorited, `;
      likeFavJoinString = ` LEFT OUTER JOIN
      "UserJokeLikes" as jokeLike
      ON
      jokeLike."jokeId" = joke.id AND jokeLike."userId" = :userId
      LEFT OUTER JOIN
      "UserJokeFavorites" as jokeFav
      ON
      jokeFav."jokeId" = joke.id AND jokeFav."userId" = :userId
      ${whereString}
      GROUP BY joke.id, movie.id, owner.id, jokeLike."userId", jokeFav."userId"
      `;

      currentUserReplacementObject = { userId: currentUserId };
    }

    if(popular){
      orderString = ' joke."likeCount" DESC ';
    }else{
      orderString = ' joke."createdAt" DESC ';
    }

    


    //TODO: remove joins when there are no other users
    return sequelize.query(`SELECT joke.*, 
      ${likeFavSelectString}
      owner.id as "owner.id", owner.username as "owner.username",  
      owner."profilePhoto" as "owner.profilePhoto",
      movie.id as "movie.id", movie.name as "movie.name", movie."tmdbMovieId" as "movie.tmdbMovieId",
      movie."jokeCount" as "movie.jokeCount", movie."followerCount" as "movie.followerCount", 
      movie."firstAirDate" as "movie.firstAirDate" 
      FROM "Jokes" as joke
      INNER JOIN 
      "Users" as owner
      ON 
      owner.id = joke."ownerId"
      INNER JOIN
      "Movies" as movie
      ON movie.id = joke."movieId"
      ${likeFavJoinString}
      ${!currentUserId? whereString : ''}
      ORDER BY ${orderString}
      LIMIT :limit OFFSET :offset`,                             
          { 
            nest: true,
            raw: true,
            model: sequelize.models.Joke,
            replacements: {offset: offset, limit: limit, ...currentUserReplacementObject, ...whereObject},
            type: sequelize.QueryTypes.SELECT
          });
  }

  Joke.associate = function(models) {
    // associations can be defined here
    Joke.belongsTo(models.User, {
      foreignKey: 'ownerId',
      as: 'owner'
    });
    Joke.belongsTo(models.Movie, {
      foreignKey: 'movieId',
      as: 'movie'
    });

    Joke.belongsToMany(models.User, {
      through: 'UserJokeLikes',
      timestamps: false,
      as: 'likers',
      foreignKey: 'jokeId'
    });

    Joke.hasMany(models.Comment, {
      foreignKey: 'ownerId',
      as: 'jokes'
    });
  };
  return Joke;
};