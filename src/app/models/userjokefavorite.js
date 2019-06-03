'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserJokeFavorite = sequelize.define('UserJokeFavorite', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    jokeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'Jokes',
        key: 'id'
      }
    }
  }, {
    timestamps: false
  });
  UserJokeFavorite.associate = function(models) {
    // associations can be defined here
  };
  return UserJokeFavorite;
};