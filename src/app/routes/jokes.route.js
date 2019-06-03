import express from 'express';
import validate  from 'express-validation';
import {jokeCreateValidator} from '../../app/middlewares/validators/joke_validator'

// const commentValidator = require('../../app/middlewares/validators/comment_validator');
import JokeController from '../../app/controllers/joke.controller';
// const authMiddleWare = require('../../app/middlewares/auth_middleware');
import paginationMiddleWare from '../../app/middlewares/pagination_middleware';
import { jwtRequiredAuthentication, jwtOptionalAuthentication } from '../middlewares/auth_middleware';


const router = express.Router();


router.route('/')
      .get([paginationMiddleWare, jwtOptionalAuthentication], JokeController.getJokes)                
      .post([jwtRequiredAuthentication, /*validate(jokeCreateValidator)*/], JokeController.addJoke);


router.route('/popular')
      .get([paginationMiddleWare, jwtOptionalAuthentication], JokeController.getJokes);
      
router.route('/:jokeId')
      .delete([jwtRequiredAuthentication],JokeController.deleteJoke);
      
router.route('/:jokeId/likes')
            .get([paginationMiddleWare],JokeController.getJokeLikers)
            .put([jwtOptionalAuthentication],JokeController.likeJoke)
            .delete([jwtOptionalAuthentication],JokeController.unlikeJoke);

router.route('/:jokeId/comments')
            .get([paginationMiddleWare], JokeController.getJokeComments)
            .post([jwtOptionalAuthentication /*, validate(commentValidator.addComment)*/], JokeController.addJokeComment);      

export default router;