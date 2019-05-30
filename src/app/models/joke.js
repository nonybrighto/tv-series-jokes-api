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

  Joke.getJokes = async function({currentUserId = null}={}){


    let options =  { 
      hasJoin: true,
      // model: sequelize.models.Joke,
      replacements: { currentUserId: currentUserId},
      // type: sequelize.QueryTypes.SELECT
      include: [
        {
        model: sequelize.models.User,
        as: 'owner'
      },
        {
        model: sequelize.models.Movie,
        as: 'movie'
      }
      ]
    }

    sequelize.models.Joke._validateIncludedElements(options);

       //TODO: remove joins when there are no other users
    return sequelize.query(`SELECT joke.*, count(case when jokeLike.userId = :currentUserId then 1 end) > 0 as isLiked, owner.id as 'owner.id', owner.username as 'owner.username',  movie.id as 'movie.id', movie.name as 'movie.name'
      FROM Jokes as joke
      INNER JOIN 
      Users as owner
      ON 
      owner.id = joke.ownerId
      INNER JOIN
      Movies as movie
      ON movie.id = joke.movieId
      LEFT OUTER JOIN
      UserJokeLikes as jokeLike
      ON
      jokeLike.jokeId = joke.id
      GROUP BY joke.title`,                             
         options);
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
  };
  return Joke;
};