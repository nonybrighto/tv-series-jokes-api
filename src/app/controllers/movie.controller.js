import httpStatus from 'http-status';
import createError from 'http-errors';
import models from '../models';
import listResponse from '../helpers/list_response';


const User = models.User;
const Joke = models.Joke;
const Movie = models.Movie;
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
       console.log(error);
    next(createError('Internal error occured while getting movie'));
   }
}
async function getMovies(req, res, next){

   try{
    let currentUserId = (req.user)? req.user.id: null;
    await listResponse({
        itemCount: await Movie.count(),
        getItems: async (offset, limit) => await  Movie.getMovies({ offset: offset, limit: limit, currentUserId: currentUserId }),
        errorMessage: 'Error occured while getting users'
    })(req, res, next);

   }catch(error){
      
    next(createError('Internal error occured while getting movies'));
   }
}
async function getMovieJokes(req, res, next){

   try{

        let currentUserId = (req.user)? req.user.id: null;
        let movieId = req.params.movieId;

        await listResponse({
            itemCount: await Joke.count({where:{movieId: movieId}}),
            getItems: async (offset, limit) => await  Joke.getJokes({ offset: offset, limit: limit, currentUserId: currentUserId, movieId: movieId }),
            errorMessage: 'Error occured while getting movie jokes'
        })(req, res, next);

   }catch(error){
    console.log(error);
    next(createError('Internal error occured while getting movies jokes'));
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
     next(createError('Internal error occured while following movie'));
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
            return next(next(createError(httpStatus.NOT_FOUND, 'Movie not followed')));
        }
         
    }catch(error){
        console.log(error);
        tr.rollback();
     next(createError('Internal error occured while following movie'));
    }
  
}


export default {getMovie, getMovies, getMovieJokes, followMovie, unfollowMovie}