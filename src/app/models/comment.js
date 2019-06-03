'use strict';
module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    anonymousName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'id'
      },
      onDelete: 'SET NULL'
    },
    jokeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Jokes',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
  }, {});
  Comment.associate = function(models) {
    // associations can be defined here
    Comment.belongsTo(models.User, {
      foreignKey: 'ownerId',
      as: 'owner'
    });
  };
  return Comment;
};