import httpStatus from 'http-status';
import createError from 'http-errors';
import models from '../models';
import * as fb from '../../config/firebase_admin';
import listResponse from '../helpers/list_response';
import internalError from '../helpers/internal_error';


const User = models.User;
const Joke = models.Joke;
const UserJokeFavorite = models.UserJokeFavorite;

async function getCurrentUser(req, res, next){

    try{

        let currentUserId = req.user.id;
        let currentUser = await User.scope('withHidden').findByPk(currentUserId);

        res.status(httpStatus.OK).send(currentUser);

    }catch(error){
        return next(internalError('getting current user', error));
    }

}
async function getFavoriteJokes(req, res, next){

    try{

        let currentUserId = req.user.id;

        await listResponse({
            itemCount: await UserJokeFavorite.count({where:{userId: currentUserId}}),
            getItems: async (offset, limit) => await  Joke.getJokes({ currentUserId: currentUserId, favorite: true, offset: offset, limit: limit }),
            errorMessage: 'getting user\'s favorite jokes'
        })(req, res, next);

    }catch(error){
        return next(internalError('getting user\'s favorite jokes', error));
    }
}
async function addJokeToFavorite(req, res, next){

    try{
        let currentUserId = req.user.id;
        let jokeId = req.params.jokeId;

        if(await UserJokeFavorite.findOne({where: {userId: currentUserId, jokeId: jokeId}})){
            next(createError(httpStatus.CONFLICT,'Joke already added to favorite'));
        }else{
            await UserJokeFavorite.create({userId: currentUserId, jokeId: jokeId});
            return res.sendStatus(httpStatus.NO_CONTENT);
        }
    }catch(error){
        return next(internalError('adding favorite joke', error));
    }
}
async function removeJokeFromFavorite(req, res, next){

    try{
        let currentUserId = req.user.id;
        let jokeId = req.params.jokeId;

        if(await UserJokeFavorite.findOne({where: {userId: currentUserId, jokeId: jokeId}})){
            await UserJokeFavorite.destroy({where:{userId: currentUserId, jokeId: jokeId}});
            return res.sendStatus(httpStatus.NO_CONTENT);
        }else{
            next(createError(httpStatus.NOT_FOUND,'Joke not in favorite'));
        }

    }catch(error){
        return next(internalError('removing favorite joke', error));
    }
}
async function getUserJokes(req, res, next){

    try{
        let currentUserId = req.user.id;

        await listResponse({
            itemCount: await Joke.count({where:{ownerId: currentUserId}}),
            getItems: async (offset, limit) => await  Joke.getJokes({ offset: offset, limit: limit, currentUserId: currentUserId, ownerId: currentUserId }),
            errorMessage: 'getting user\'s jokes'
        })(req, res, next);

    }catch(error){
        return next(internalError('getting user\'s jokes', error));
    }
}



async function changeProfilePhoto(req, res, next){

    try{

        let profilePhoto = req.file;
        if(profilePhoto){
            let currentUserId = req.user.id;
            let currentUser = await User.findByPk(currentUserId);

            let photoUrl = await fb.upload(profilePhoto);
            await User.update({profilePhoto: photoUrl}, {where: {id: currentUserId}});
            
            try{
                await fb.remove(currentUser.profilePhoto);
             }catch(error){
                 //log file could not be deleted .. will delete later
                 console.log('DELETE ERROR');
                 console.log(error);
             }
             let updatedUser = await User.scope('withHidden').findByPk(currentUserId);
            return res.status(httpStatus.OK).send(updatedUser);
        }else{
            next(createError(httpStatus.UNPROCESSABLE_ENTITY,'Image file should be present'));
        }

    }catch(error){
        return next(internalError('changing profile photo', error));
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

export default {getCurrentUser, getFavoriteJokes,  changeProfilePhoto, addJokeToFavorite, removeJokeFromFavorite, getUserJokes, changePassword};



