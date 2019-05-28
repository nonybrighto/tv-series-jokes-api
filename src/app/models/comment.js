'use strict';
module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    content: {
      type: DataTypes.TEXT
    },
    ownerId: {
      type: DataTypes.INTEGER
    },
    movieId: {
      type: DataTypes.INTEGER
    },
  }, {});
  Comment.associate = function(models) {
    // associations can be defined here
  };
  return Comment;
};