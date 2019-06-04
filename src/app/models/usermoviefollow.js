'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserMovieFollow = sequelize.define('UserMovieFollow', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'Users',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    movieId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'Movies',
        key: 'id'
      },
      onDelete: 'CASCADE'
    }
  }, {
    timestamps: false
  });
  UserMovieFollow.associate = function(models) {
    // associations can be defined here
  };

  return UserMovieFollow;
};