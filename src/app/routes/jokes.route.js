import express from 'express';
import validate  from 'express-validation';
import jokeValidator from '../../app/middlewares/validators/joke_validator'
import  commentValidator from '../../app/middlewares/validators/comment_validator';
import JokeController from '../../app/controllers/joke.controller';
import paginationMiddleWare from '../../app/middlewares/pagination_middleware';
import { jwtRequiredAuthentication, jwtOptionalAuthentication } from '../middlewares/auth_middleware';
import FileUploader from '../helpers/file_uploader';


const router = express.Router();
const fileUploader = new FileUploader();

router.route('/')
      .get([paginationMiddleWare, jwtOptionalAuthentication], JokeController.getJokes)                
      .post([jwtRequiredAuthentication, fileUploader.imageUploadMiddleWare(), validate(jokeValidator.addJoke)], JokeController.addJoke);


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
            .post([jwtOptionalAuthentication, validate(commentValidator.addComment)], JokeController.addJokeComment);
            
router.route('/:jokeId/reports')
            .put([jwtOptionalAuthentication], JokeController.reportJoke);

export default router;