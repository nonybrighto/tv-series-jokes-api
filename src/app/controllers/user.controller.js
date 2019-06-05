import httpStatus from 'http-status';
import createError from 'http-errors';
import models from '../models';
import listResponse from '../helpers/list_response';


const User = models.User;
const Joke = models.Joke;
const UserJokeFavorite = models.UserJokeFavorite;
const sequelize = models.sequelize;


async function getCurrentUser(req, res, next){

    try{

        let currentUserId = req.user.id;
        let currentUser = await User.scope('withHidden').findByPk(currentUserId);

        res.status(httpStatus.OK).send(currentUser);

    }catch(error){
        console.log(error);
        next(createError('Error occured while changing current user'));
    }

}
async function getFavoriteJokes(req, res, next){

    try{

        let currentUserId = req.user.id;

        await listResponse({
            itemCount: await UserJokeFavorite.count({where:{userId: currentUserId}}),
            getItems: async (offset, limit) => await  Joke.getJokes({ currentUserId: currentUserId, favorite: true, offset: offset, limit: limit }),
            errorMessage: 'Error occured while getting favorite jokes'
        })(req, res, next);

    }catch(error){
        console.log(error);
        next(createError('Error occured while getting favorite jokes'));
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
        console.log(error);
        next(createError('Error occured while adding favorite joke'));
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
        console.log(error);
        next(createError('Error occured while removing favorite joke'));
    }
}
async function getUserJokes(req, res, next){

    try{
        let currentUserId = req.user.id;

        await listResponse({
            itemCount: await Joke.count({where:{ownerId: currentUserId}}),
            getItems: async (offset, limit) => await  Joke.getJokes({ offset: offset, limit: limit, currentUserId: currentUserId, ownerId: currentUserId }),
            errorMessage: 'Error occured while getting user jokes'
        })(req, res, next);

    }catch(error){
        console.log(error);
        next(createError('Error occured while getting user jokes joke'));
    }
}



async function changeProfilePhoto(req, res, next){

    try{

        let profilePhoto = req.file;
        if(profilePhoto){
            let currentUserId = req.user.id;
            //upload to firebase
            let photoUrl = 'the new photo url'
            await User.update({profilePhoto: photoUrl}, {where: {id: currentUserId}});
            res.sendStatus(httpStatus.NO_CONTENT);
        }else{
            next(createError(httpStatus.UNPROCESSABLE_ENTITY,'Image file should be present'));
        }

    }catch(error){
        console.log(error);
        next(createError('Error occured while changing profile photo'));
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
        console.log(error);
        next(createError('Error occured while changing password'));
    }

}

export default {getCurrentUser, getFavoriteJokes,  changeProfilePhoto, addJokeToFavorite, removeJokeFromFavorite, getUserJokes, changePassword};



