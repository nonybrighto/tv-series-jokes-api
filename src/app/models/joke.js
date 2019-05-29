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