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

  Joke.getJokes = async function({currentUserId = null, popular = false, offset = 0, limit = 200}={}){

    let likeFavSelectString = '';
    let likeFavJoinString = '';
    let orderString = '';
    let currentUserReplacementObject = {};

    if(currentUserId){
      likeFavSelectString = ` count(case when jokeLike."userId" = :currentUserId then 1 end) > 0 as liked,
      count(case when jokeFav."userId" = :currentUserId then 1 end) > 0 as favorited, `;
      likeFavJoinString = ` LEFT OUTER JOIN
      "UserJokeLikes" as jokeLike
      ON
      jokeLike."jokeId" = joke.id
      LEFT OUTER JOIN
      "UserJokeFavorites" as jokeFav
      ON
      jokeFav."jokeId" = joke.id 
      GROUP BY joke.id, movie.id, owner.id
      `;

      currentUserReplacementObject = { currentUserId: currentUserId };
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
      ORDER BY ${orderString}
      LIMIT 10 OFFSET 0`,                             
          { 
            nest: true,
            raw: true,
            model: sequelize.models.Joke,
            replacements: {offset: offset, limit: limit, ...currentUserReplacementObject},
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