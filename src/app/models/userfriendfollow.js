'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserFriendFollow = sequelize.define('UserFriendFollow', {
    followerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'Users',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    followingId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'Users',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
  }, {
    timestamps: false
  });
  UserFriendFollow.associate = function(models) {
    // associations can be defined here
  };
  return UserFriendFollow;
};