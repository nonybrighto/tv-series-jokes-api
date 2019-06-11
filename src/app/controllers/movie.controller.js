import httpStatus from 'http-status';
import createError from 'http-errors';
import models from '../models';
import listResponse from '../helpers/list_response';
import internalError from '../helpers/internal_error';


const Joke = models.Joke;
const Movie = models.Movie;
const User = models.User;
const UserMovieFollow = models.UserMovieFollow;
const sequelize = models.sequelize;

async function getMovie(req, res, next){

   try{

    let currentUserId = (req.user)? req.user.id: null;
    let movieId = req.params.movieId;

            let movie = await Movie.getMovie({movieId: movieId, currentUserId: currentUserId});
            if(movie){
                res.status(httpStatus.OK).send(movie);
            }else{
                next(createError(httpStatus.NOT_FOUND, 'Movie could not be found'));
            }
   }catch(error){
       return next(internalError('getting movie', error));
   }
}
async function getMovies(req, res, next){

   try{
    let currentUserId = (req.user)? req.user.id: null;
    await listResponse({
        itemCount: await Movie.count(),
        getItems: async (offset, limit) => await  Movie.getMovies({ offset: offset, limit: limit, currentUserId: currentUserId }),
        errorMessage: 'getting movies'
    })(req, res, next);

   }catch(error){
    return next(internalError('getting movies', error));
   }
}
async function getMovieJokes(req, res, next){

   try{

        let currentUserId = (req.user)? req.user.id: null;
        let movieId = req.params.movieId;

        await listResponse({
            itemCount: await Joke.count({where:{movieId: movieId}}),
            getItems: async (offset, limit) => await  Joke.getJokes({ offset: offset, limit: limit, currentUserId: currentUserId, movieId: movieId }),
            errorMessage: 'getting movie jokes'
        })(req, res, next);

   }catch(error){
    return next(internalError('getting movies jokes', error));
   }
}

async function getMovieFollowers(req, res, next){


    try{
        let movieId = req.params.movieId;
        let currentUserId = (req.user)? req.user.id: null;
        await listResponse({
            itemCount: await UserMovieFollow.count({where: {movieId:movieId}}),
            getItems: async (skip, limit) => await User.getUsers({ currentUserId: currentUserId, movieId: movieId, offset: skip, limit: limit }),
            errorMessage: 'getting movies'
        })(req, res, next);
    
       }catch(error){
        return next(internalError('getting movies', error));
       }



}
async function followMovie(req, res, next){

    let tr = await sequelize.transaction();
    try{
 
         let currentUserId  = req.user.id;
         let movieId = req.params.movieId;
 
         if(await UserMovieFollow.findOne({where: {userId: currentUserId, movieId: movieId}})){
             return next(next(createError(httpStatus.CONFLICT, 'Movie already followed')));
         }
         await UserMovieFollow.create({userId: currentUserId, movieId: movieId}, {transaction: tr});
         await Movie.update({followerCount: models.sequelize.literal('"followerCount" + 1')}, {where: {id: movieId}, transaction: tr});
         tr.commit();
         return res.sendStatus(httpStatus.NO_CONTENT);
         
    }catch(error){
        console.log(error);
        tr.rollback();
        return next(internalError('following movie', error));
     
    }
}
async function unfollowMovie(req, res, next){

    let tr = await sequelize.transaction();
    try{
 
        let currentUserId  = req.user.id;
        let movieId = req.params.movieId;
 
        if(await UserMovieFollow.findOne({where: {userId: currentUserId, movieId: movieId}})){
            await UserMovieFollow.destroy({where: {userId: currentUserId, movieId: movieId}, transaction: tr});
            await Movie.update({followerCount: models.sequelize.literal('"followerCount" - 1')}, {where: {id: movieId}, transaction: tr});
            tr.commit();
            return res.sendStatus(httpStatus.NO_CONTENT);
        }else{
            return next(next(createError(httpStatus.NOT_FOUND, 'Movie not unfollowed')));
        }
         
    }catch(error){
        tr.rollback();
        return next(internalError('unfollowing movie', error));
    }
  
}


export default {getMovie, getMovies, getMovieJokes, getMovieFollowers,followMovie, unfollowMovie}