import express from 'express';
import movieController from '../controllers/movie.controller';
import {jwtRequiredAuthentication, jwtOptionalAuthentication} from '../middlewares/auth_middleware';
import paginationMiddleware from '../middlewares/pagination_middleware';


const router = express.Router();

router.route('/')
    .get([ jwtOptionalAuthentication, paginationMiddleware], movieController.getMovies);

router.route('/:movieId')
      .get([jwtOptionalAuthentication], movieController.getMovie);

router.route('/:movieId/jokes')
      .get([jwtOptionalAuthentication, paginationMiddleware],movieController.getMovieJokes);

router.route('/:movieId/followers')
      .get([jwtOptionalAuthentication, paginationMiddleware], movieController.getMovieFollowers)
      .put([jwtRequiredAuthentication], movieController.followMovie)
      .delete([jwtRequiredAuthentication], movieController.unfollowMovie)


export default router;