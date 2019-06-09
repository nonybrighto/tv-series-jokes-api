import httpStatus from 'http-status';
import createError from 'http-errors';
import models from '../models';
import listResponse from '../helpers/list_response';
import internalError from '../helpers/internal_error';


const User = models.User;
const UserFriendFollow = models.UserFriendFollow;
const Joke = models.Joke;
const sequelize = models.sequelize;

async function getAllUsers(req, res, next){
       
    try{ 
        let currentUserId = (req.user)? req.user.id: null;       
        await listResponse({
            itemCount: await User.count(),
            getItems: async (skip, limit) => await  User.getUsers({ currentUserId: currentUserId, offset: skip, limit: limit }),
            errorMessage: 'getting users'
        })(req, res, next);
    }catch(error){
        return next(internalError('getting users', error));
    }  
}

async function getUser(req, res, next){

    try{

        let currentUserId = (req.user)? req.user.id: null;
        let userId = req.params.userId;
    
                let user = await User.getUser({userId: userId, currentUserId: currentUserId});
                if(user){
                    res.status(httpStatus.OK).send(user);
                }else{
                    next(createError(httpStatus.NOT_FOUND, 'User could not be found'));
                }


    }catch(error){
        return next(internalError('getting user', error));
    }

}

async function getUserFollowers(req, res, next){

    try{
        let userId = req.params.userId;
        let currentUserId = (req.user)? req.user.id: null;       
        await listResponse({
            itemCount: await UserFriendFollow.count({where:{followingId: userId}}),
            getItems: async (skip, limit) => await  User.getUsers({ currentUserId: currentUserId, userId: userId, followers: true, offset: skip, limit: limit }),
            errorMessage: 'Error occured while getting users'
        })(req, res, next);

    }catch(error){
        return next(internalError('getting user followers', error));
    }
}

async function followUser(req, res, next){

    let tr = await sequelize.transaction();
    try{
 
         let currentUserId  = req.user.id;
         let userId = req.params.userId;
 
         if(await UserFriendFollow.findOne({where: {followerId: currentUserId, followingId: userId}})){
             return next(next(createError(httpStatus.CONFLICT, 'User already followed')));
         }
         await UserFriendFollow.create({followerId: currentUserId, followingId: userId}, {transaction: tr});
         await User.update({followerCount: models.sequelize.literal('"followerCount" + 1')}, {where: {id: userId}, transaction: tr});
         tr.commit();
         return res.sendStatus(httpStatus.NO_CONTENT);
         
    }catch(error){
        tr.rollback();
        return next(internalError('following user', error));
    }

}

async function unfollowUser(req, res, next){

    let tr = await sequelize.transaction();
    try{
 
        let currentUserId  = req.user.id;
        let userId = req.params.userId;
 
        if(await UserFriendFollow.findOne({where: {followerId: currentUserId, followingId: userId}})){
            await UserFriendFollow.destroy({where: {followerId: currentUserId, followingId: userId}, transaction: tr});
            await User.update({followerCount: models.sequelize.literal('"followerCount" - 1')}, {where: {id: userId}, transaction: tr});
            tr.commit();
            return res.sendStatus(httpStatus.NO_CONTENT);
        }else{
            return next(next(createError(httpStatus.NOT_FOUND, 'User not followed')));
        }
         
    }catch(error){
        tr.rollback();
        return next(internalError('unfollowing user', error));
    }

}

async function getUserFollowing(req, res, next){

    try{

        let userId = req.params.userId;
        let currentUserId = (req.user)? req.user.id: null;       
        await listResponse({
            itemCount: await UserFriendFollow.count({where:{followerId: userId}}),
            getItems: async (skip, limit) => await  User.getUsers({ currentUserId: currentUserId, userId: userId, following: true, offset: skip, limit: limit }),
            errorMessage: 'getting users'
        })(req, res, next);


    }catch(error){
        return next(internalError('getting users', error));
    }

}
async function getUserJokes(req, res, next){

    try{

        let currentUserId = (req.user)? req.user.id: null;
        let userId = req.params.userId;

        await listResponse({
            itemCount: await Joke.count({where:{ownerId: userId}}),
            getItems: async (offset, limit) => await  Joke.getJokes({ offset: offset, limit: limit, currentUserId: currentUserId, ownerId: userId }),
            errorMessage: 'getting user jokes'
        })(req, res, next);

   }catch(error){
    return next(internalError('getting user jokes', error));
   }

}

async function changePassword(req, res, next){

    try{
        let oldPassword = req.body.oldPassword;
        let newPassword = req.body.newPassword;

        // @ts-ignore
        let user = await User.canLogin(req.user.username, oldPassword);
        if(user){
                // @ts-ignore
               let changed = await user.changePassword(newPassword);
               if(changed){
                    res.sendStatus(200);
               }else{
                    throw new Error('Could not change password');
               }
        }else{
            next(createError(httpStatus.FORBIDDEN, 'not permitted to change password'));
        }
    }catch(error){
        return next(internalError('changing password', error));
    }

}

export default {getAllUsers, getUser, getUserFollowers, followUser, unfollowUser, getUserFollowing, getUserJokes, changePassword};



