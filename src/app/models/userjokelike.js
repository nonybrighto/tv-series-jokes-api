'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserJokeLike = sequelize.define('UserJokeLike', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    jokeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Jokes',
        key: 'id'
      }
    }
  }, {
    timestamps: false
  });

  UserJokeLike.likers = async function(jokeId){

       
        return sequelize.query(`SELECT liker.* FROM Users as liker 
                              INNER JOIN UserJokeLikes as jokeLikes 
                              on liker.id = jokeLikes.userId  
                              where jokeLikes.jokeId = :jokeId`,                             
                              { 
                                nest: true,
                                model: sequelize.models.User,
                                replacements: { jokeId:jokeId},
                                type: sequelize.QueryTypes.SELECT
                              });
  }
  UserJokeLike.associate = function(models) {
    
    UserJokeLike.belongsTo(models.Joke, {
        foreignKey: 'jokeId',
        as: 'joke'
    });
    UserJokeLike.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'liker'
    });

  };
  return UserJokeLike;
};