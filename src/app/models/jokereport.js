'use strict';
module.exports = (sequelize, DataTypes) => {
  const jokeReport = sequelize.define('JokeReport', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    jokeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Jokes',
        key: 'id'
      },
      onDelete: 'CASCADE'
    }
  }, {
    timestamps: false
  });
  jokeReport.associate = function(models) {
    // associations can be defined here
  };
  return jokeReport;
};