import express from 'express';
import usersController from '../controllers/users.controller';
import paginationMiddleware from '../middlewares/pagination_middleware';
import { jwtOptionalAuthentication, jwtRequiredAuthentication } from '../middlewares/auth_middleware';
const router = express.Router();


router.route('/')
     .get([ paginationMiddleware, jwtOptionalAuthentication], usersController.getAllUsers);

     router.route('/:userId')
     .get([jwtOptionalAuthentication], usersController.getUser);

router.route('/:userId/followers')
     .get([ paginationMiddleware, jwtOptionalAuthentication],usersController.getUserFollowers)
     .put([jwtRequiredAuthentication],usersController.followUser)
     .delete([jwtRequiredAuthentication],usersController.unfollowUser);

router.route('/:userId/following')
     .get([ paginationMiddleware, jwtOptionalAuthentication],usersController.getUserFollowing);

router.route('/:userId/jokes')
     .get([jwtOptionalAuthentication, paginationMiddleware], usersController.getUserJokes)


export default router;