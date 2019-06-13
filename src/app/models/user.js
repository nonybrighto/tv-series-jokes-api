'use strict';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import {validEmail} from '../helpers/validators';
import config from './../../config/config';


module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING
    },
    email: {
      type: DataTypes.STRING
    },
    profilePhoto: {
      type: DataTypes.STRING,
      allowNull: true
    },
    password: {
      type: DataTypes.STRING,
    },
    jokeCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0 
    },
    followerCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0 
    },
    followingCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0 
    }
  }, {
    defaultScope: {
      attributes: { exclude: ['password', 'email'] },
    },
    scopes: {
      withHidden: {
          attributes: { },
      }
    }  
  });
  User.associate = function(models) {
    // associations can be defined here
    User.hasMany(models.Joke, {
      foreignKey: 'ownerId',
      as: 'jokes'
    });

    User.hasMany(models.Comment, {
      foreignKey: 'ownerId',
      as: 'comments'
    });

    User.belongsToMany(models.Joke, {
      through: 'UserJokeLikes',
      as: 'likedJokes',
      foreignKey: 'userId'
    });
  };

  User.beforeCreate(async (user, options) => {
    let passwordHash = await bcrypt.hash(user.password, 10);
    user.password = passwordHash;
  });

  User.prototype.changePassword = async function(newPassword){

    this.password =  await bcrypt.hash(newPassword, 10);;
    let user = await this.save();
    if(user){
        return true;
    }
    return false;

}

  User.prototype.toJSON =  function () {
    var values = Object.assign({}, this.get());
  
    delete values.password;
    return values;
  }

  User.prototype.generateJwtToken = function(){

    let expireDays = config.get('jwt_token-expire-days');

    return jwt.sign(
        {id:this.id, username: this.username, email: this.email},
        config.get('jwt-secret'),
        {expiresIn: expireDays+' days'}
    );
}

  User.prototype.toAuthJSON = function (){

    let expireDays = config.get('jwt_token-expire-days');
    let expirationDate = new Date();
    expirationDate.setDate(new Date().getDate() + expireDays);

    return {token: this.generateJwtToken(), tokenExpires: expirationDate, user: {id: this.id, username: this.username, email: this.email, profilePhoto: this.profilePhoto, followerCount: this.followerCount, followingCount: this.followingCount, jokeCount: this.jokeCount}};
  }

  User.getUsers = async function({currentUserId, userId, followers, following, movieId, limit, offset}){


    let userFollowString = '';
    let userFollowJoinString = '';
    let whereString = '';
    let limitOffsetString = '';
    let followersString = '';
    let followingString = '';
    let movieString = '';
    if(currentUserId){
      userFollowString = ' , flwr."followingId" IS NOT NULL as "followed", flwg."followerId" IS NOT NULL as "following" ';

      userFollowJoinString = `  LEFT OUTER JOIN
      "UserFriendFollows" as flwr
      ON
      usr.id = flwr."followingId" AND flwr."followerId" = :currentUserId
      LEFT OUTER JOIN
      "UserFriendFollows" as flwg
      ON
      usr.id = flwg."followerId" AND flwg."followingId" = :currentUserId `;
    }

    if(followers){
      followersString = ` INNER JOIN
      "UserFriendFollows" as ffl
      ON
      usr.id = ffl."followerId" AND ffl."followingId" = :userId `;
    }else if(following){
      followingString = ` INNER JOIN
      "UserFriendFollows" as ffl
      ON
      usr.id = ffl."followingId" AND ffl."followerId" = :userId `;
    }else if(movieId){
        movieString = ` INNER JOIN 
        "UserMovieFollows" as umf
        ON
        usr."id" = umf."userId" AND umf."movieId" = :movieId `
    }

    if(userId && !followers && !following){
      whereString = ' WHERE usr.id = :userId '
    }else{
      limitOffsetString = ` LIMIT :limit OFFSET :offset `;
    }

    return sequelize.query(`SELECT usr.id, usr.username,usr."profilePhoto",
                        usr."jokeCount", usr."followerCount",
                        usr."followingCount" ${userFollowString}
                        FROM "Users" as usr
                         ${followersString}
                         ${followingString}
                         ${movieString}
                         ${userFollowJoinString} 
                         ${whereString}
                         ${limitOffsetString} `,                             
                          { 
                            nest: true,
                            model: sequelize.models.User,
                            replacements: { currentUserId: currentUserId, userId: userId, movieId:movieId, limit: limit, offset: offset },
                            type: sequelize.QueryTypes.SELECT
                          });
  }

User.getUser = async function({userId, currentUserId}){

    let user = await User.getUsers({userId: userId, currentUserId: currentUserId});
    return (user.length > 0)? user[0] : null;
}

  User.canLogin = async function(credential, password){

    let userDataToFind = {};
    if(validEmail(credential)){
        userDataToFind['email'] = credential;
    }else{
        userDataToFind['username'] = credential;
    }
   
    let user = await this.scope('withHidden').findOne({where: userDataToFind});
    if(user){
        let passwordMatch = await bcrypt.compare(password, user.password);
            if (passwordMatch) {
                return user;
            } else {
                return false;
            }
    }
    return false;
}

User.findOrCreateSocialUser = async function({email, name, profilePhoto}){

  let user = await this.findOne({where:{email: email}});
  if(user){
      return user;
  }else{
      let username = name.split(' ')[0].trim();
      while(await this.findOne({where:{username: username}})){
          let randomNumbers = Math.floor(Math.random() * 90);
          username = username+randomNumbers;
      }

      let  randomPasswordString  = Math.random().toString(36).slice(-8);
      let userRegistered = await this.create({username: username, email:email, password:randomPasswordString, profilePhoto: profilePhoto});

      return userRegistered;
  }

}

  return User;
};