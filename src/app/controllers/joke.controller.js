import createError from 'http-errors';
import httpStatus from 'http-status';
import got from 'got';
import * as fb from '../../config/firebase_admin';
import models from '../models';
import listResponse from '../helpers/list_response';
import config from '../../config/config';
import internalError from '../helpers/internal_error';


const User = models.User;
const Joke = models.Joke;
const UserJokeLike = models.UserJokeLike;
const JokeReport = models.JokeReport;
const Comment = models.Comment;
const Movie = models.Movie;
const sequelize = models.sequelize;


async function addJoke(req, res, next){
    let tr = await sequelize.transaction();
    try{
        let currentUserId = req.user.id;
        let tmdbMovieId = +req.body.tmdbMovieId;
        let text = req.body.text;    
        let canAddMovie = false;
        let imageFile = req.file;
        

        let jokeMovie = await Movie.findOne({where: {tmdbMovieId: tmdbMovieId}});
        if(jokeMovie){
            canAddMovie = true;
        }else{
            let apiKey = config.get('tmdb-api-key');
            let response = await got(`https://api.themoviedb.org/3/tv/${tmdbMovieId}?api_key=${apiKey}&append_to_response=credits,images`);
            
            let gottenMovie = JSON.parse(response.body);

            let movieAdded = await Movie.create({name: gottenMovie.name, tmdbMovieId: gottenMovie.id, overview: gottenMovie.overview, posterPath: gottenMovie.poster_path, firstAirDate: gottenMovie.first_air_date});
            if(movieAdded){
                jokeMovie = movieAdded;
                canAddMovie = true;
            }
        }

        if(canAddMovie){
            if(text === null &&  imageFile === null ){
                return  next(createError(httpStatus.UNPROCESSABLE_ENTITY, 'Joke could not be found'));
            }
            let imageUrl;
            if(imageFile){
                //TODO: upload image and get URL
                //admin.storage()
                imageUrl = await fb.upload(imageFile);
            }
            
            let jokeAdded = await Joke.create({text:text, movieId: jokeMovie.id, ownerId: currentUserId, imageUrl: imageUrl}, {transaction: tr});

        await User.update({jokeCount: models.sequelize.literal('"jokeCount" + 1')}, {where: {id: currentUserId}, transaction: tr});
        await Movie.update({jokeCount: models.sequelize.literal('"jokeCount" + 1')}, {where: {tmdbMovieId: tmdbMovieId}, transaction: tr});

        await tr.commit();

        let joke = await Joke.findOne({where: {id: jokeAdded.id}, include: [{
            model: User,
            as: 'owner'
          },{
            model: Movie,
            as: 'movie'
          }]});

          return res.status(httpStatus.CREATED).send(joke);
        }


    }catch(error){
        tr.rollback();
        return next(internalError('adding joke', error));
    }
    
}

async function deleteJoke(req, res, next){
    let tr = await sequelize.transaction();
    try{
        let currentUserId = req.user.id;
        let jokeId = req.params.jokeId;
        let joke = await Joke.findByPk(jokeId);

        if(!joke){
            return next(createError(httpStatus.NOT_FOUND, 'Joke could not be found'));
        }else if(currentUserId === joke.ownerId || req.user.isAdmin){

            //TODO: remove the jokes image if any
            if(joke.imageUrl){
                await fb.remove(joke.imageUrl);
            }

            await Joke.destroy({where:{id: jokeId}, transaction: tr});
            await User.update({jokeCount: models.sequelize.literal('"jokeCount" - 1')}, {where: {id: joke.ownerId}, transaction: tr});
            await Movie.update({jokeCount: models.sequelize.literal('"jokeCount" - 1')}, {where: {id: jokeId}, transaction: tr});
            tr.commit();

            res.sendStatus(httpStatus.NO_CONTENT);

        }else{
            return next(createError(httpStatus.UNAUTHORIZED, 'You cannot delete another user\'s joke'));
        }

    }catch(error){
        tr.rollback();
        return next(internalError('deleting joke', error));
    }
}

async function getJokes(req, res, next){

    try{
    let currentUserId = (req.user)? req.user.id: null;
    let popular = req.path === '/popular';
    

        await listResponse({
            itemCount: await Joke.count(),
            getItems: async (offset, limit) => {
                let jokes = await  Joke.getJokes({currentUserId: currentUserId, popular: popular, offset: offset, limit: limit});
                jokes.map((joke) =>{
                    joke.favorited = joke.favorited || false;
                    joke.liked = joke.liked || false;
                    return joke;
                });
                return jokes;
            },
            errorMessage: 'getting jokes'
        })(req, res, next);

    }catch(error){
        return next(internalError('getting jokes', error));
    }

}

async function getJokeLikers(req, res, next){

    try{

        let jokeId = req.params.jokeId;
        await listResponse({
            itemCount: await UserJokeLike.count({where: {jokeId: jokeId}}),
            getItems: async (skip, limit) => await UserJokeLike.likers(jokeId),
            errorMessage: 'getting joke likes'
        })(req, res, next);
        

    }catch(error){
        return next(internalError('getting joke likes', error));
    }

}

async function likeJoke(req, res, next){
    
    let tr = await sequelize.transaction();
    try{
        let jokeId = req.params.jokeId;
        if(req.user){
            let currentUserId = req.user.id;
            let liked = await UserJokeLike.findOne({where: {userId: currentUserId, jokeId: jokeId}});
            if(liked){
                return next(createError(httpStatus.CONFLICT, 'Joke has already been liked'));
            }
            await UserJokeLike.create({userId: currentUserId, jokeId: jokeId}, {transaction: tr});
        }

        await Joke.update({likeCount: models.sequelize.literal('"likeCount" + 1')}, {where: {id: jokeId}, transaction: tr});

        tr.commit();
        return res.sendStatus(httpStatus.NO_CONTENT);
        
    }catch(error){
        tr.rollback();
        return next(internalError('liking joke', error));
    }
    
}
async function unlikeJoke(req, res, next){
    let tr = await sequelize.transaction();
    try{
        let jokeId = req.params.jokeId;
        if(req.user){
            let currentUserId = req.user.id;
            let liked = await UserJokeLike.findOne({where: {userId: currentUserId, jokeId: jokeId}, transaction: tr});

           if(liked){
            await liked.destroy({transaction: tr});
            await Joke.update({likeCount: models.sequelize.literal('"likeCount" - 1')}, {where: {id: jokeId}, transaction: tr});
           }else{
            return next(createError(httpStatus.NOT_FOUND, 'Joke wasn\'t liked'));
           }

            tr.commit();
            return res.sendStatus(httpStatus.NO_CONTENT);
        }else{
          
            return next(createError(httpStatus.FORBIDDEN, 'Only authenticated user can unlike joke'));
        }

       
        
        
    }catch(error){
        tr.rollback();
        return next(internalError('unliking joke', error));
    }
    
}

async function addJokeComment(req, res, next){
    let tr = await sequelize.transaction();
    try{

        let currentUserId = (req.user) ? req.user.id : null;
        let jokeId = req.params.jokeId;
        let content = req.body.content;
        let anonymousName = req.body.anonymousName || 'anonymous';

        if(currentUserId){
            anonymousName = null;
        }

        let commentAdded =  await Comment.create({content: content, ownerId: currentUserId, anonymousName: anonymousName , jokeId: jokeId},{transaction: tr});

         await Joke.update({commentCount: models.sequelize.literal('"commentCount" + 1')}, {where: {id: jokeId}, transaction: tr});

         await tr.commit();

         let comment = await Comment.findOne({where: {id: commentAdded.id }, include: [{
            model: User,
            as: 'owner'
          }]});
         res.status(httpStatus.CREATED).send(comment);

    }catch(error){
        tr.rollback();
        return next(internalError('adding comment', error));
    }
    
}

async function getJokeComments(req, res, next){

    try{

        let jokeId = req.params.jokeId;

        await listResponse({
            itemCount: await Comment.count({where: {jokeId: jokeId}}),
            getItems: async (skip, limit) => await Comment.findAll({ where:{jokeId: jokeId}, include: [{
                model: User,
                as: 'owner'
              }], offset: skip, limit: limit }),
            errorMessage: 'getting comments'
        })(req, res, next);
        
    }catch(error){
        return next(internalError('getting comments', error));
    }
    
}
async function reportJoke(req, res, next){

    try{

        let jokeId = req.params.jokeId;
        let currentUserId = (req.user) ? req.user.id : null;

        await JokeReport.create({userId: currentUserId, jokeId:jokeId});
        res.sendStatus(httpStatus.NO_CONTENT);
        
    }catch(error){
        return next(internalError('reporting joke', error));
    }
    
}

export default {addJoke, getJokes, deleteJoke, getJokeLikers, likeJoke, unlikeJoke, addJokeComment, getJokeComments, reportJoke};