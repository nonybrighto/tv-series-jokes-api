import express from 'express';
import userController from '../controllers/user.controller';
import paginationMiddleware from '../middlewares/pagination_middleware';
import { jwtOptionalAuthentication, jwtRequiredAuthentication } from '../middlewares/auth_middleware';
const router = express.Router();


router.route('/')
     .get([ paginationMiddleware, jwtOptionalAuthentication], userController.getAllUsers);

     router.route('/:userId')
     .get([jwtOptionalAuthentication], userController.getUser);

router.route('/:userId/followers')
     .get([ paginationMiddleware, jwtOptionalAuthentication],userController.getUserFollowers)
     .put([jwtRequiredAuthentication],userController.followUser)
     .delete([jwtRequiredAuthentication],userController.unfollowUser);

router.route('/:userId/following')
     .get([ paginationMiddleware, jwtOptionalAuthentication],userController.getUserFollowing);

router.route('/:userId/jokes')
     .get([jwtOptionalAuthentication, paginationMiddleware], userController.getUserJokes)


export default router;