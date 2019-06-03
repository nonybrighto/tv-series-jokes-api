import createError from 'http-errors';
import httpStatus from 'http-status';
import models from '../models';
import listResponse from '../helpers/list_response';


const User = models.User;
const Joke = models.Joke;
const UserJokeLike = models.UserJokeLike;
const Comment = models.Comment;
const sequelize = models.sequelize;


async function addJoke(req, res, next){

    try{
        let userId = req.user.id;
        let title = req.body.title;
        let tmdbMovieId = +req.body.tmdbMovieId;
        let text = req.body.text;
        let image;
    
        let canAddMovie = false;
    
        let imageFile = req.file;

    }catch(error){
        console.log(error);
        next(createError('Internal error occured while adding joke'));
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
            errorMessage: 'Error occured while getting jokes'
        })(req, res, next);

    }catch(err){
        console.log(err);
        next(createError('Internal error occured while getting jokes'));
    }

}

async function getJokeLikers(req, res, next){

    try{

        let jokeId = req.params.jokeId;
        await listResponse({
            itemCount: await UserJokeLike.count({where: {jokeId: jokeId}}),
            getItems: async (skip, limit) => await UserJokeLike.likers(jokeId),
            errorMessage: 'Error occured while getting joke likes'
        })(req, res, next);
        

    }catch(err){
        console.log(err);
        next(createError('Internal error occured while getting joke likes'));
    }

}

async function deleteJoke(req, res, next){

    try{
        let jokeId = req.params.jokeId;
        let currentUserId = req.user.id;

        let joke = await Joke.findByPk(jokeId);
        if(!joke){
            next(createError(httpStatus.NOT_FOUND, 'Joke could not be found'));
        }else if(joke.ownerId === currentUserId){
            
            let deleted = await joke.destroy();
            if(deleted){
                //TODO:remove from server
                return res.sendStatus(httpStatus.NO_CONTENT);
            }else{
                console.log('error');
                return next(createError('Internal error occured while deleting joke'));
            }

        }else{
            next(createError(httpStatus.FORBIDDEN, 'You dont have the permission to delete this joke'));
        }




    }catch(error){
        console.log(error);
        return next(createError('Internal error occured while deleting joke'));
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
        console.log(error);
        tr.rollback();
        return next(createError('Internal error occured while liking joke'));
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
        console.log(error);
        tr.rollback();
        return next(createError('Internal error occured while unliking joke'));
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

         tr.commit();

         let comment = await Comment.findOne({where: {id: commentAdded.id }});
         res.status(httpStatus.CREATED).send(comment);

    }catch(error){
        console.log(error);
        tr.rollback();
        return next(createError('Internal error occured while adding comment'));
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
            errorMessage: 'Error occured while getting users'
        })(req, res, next);
        
    }catch(error){
        console.log(error);
        return next(createError('Internal error occured while getting comments'));
    }
    
}

export default {addJoke, getJokes, deleteJoke, getJokeLikers, likeJoke, unlikeJoke, addJokeComment, getJokeComments};