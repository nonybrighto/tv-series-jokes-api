import express from 'express';
import multer from 'multer';
import userController from '../controllers/user.controller';
import {jwtRequiredAuthentication} from '../middlewares/auth_middleware';
import paginationMiddleware from '../middlewares/pagination_middleware';

const router = express.Router();
const upload = multer({
      storage: multer.memoryStorage(),
      limits: {
        fileSize: 2 * 1024 * 1024 // no larger than 5mb, you can change as needed.
      }
    });


router.route('/')
      .get([jwtRequiredAuthentication], userController.getCurrentUser);
router.route('/favorites/jokes')
      .get([jwtRequiredAuthentication, paginationMiddleware], userController.getFavoriteJokes);
router.route('/photo')
      .put([jwtRequiredAuthentication, upload.single('image')], userController.changeProfilePhoto);
           

router.route('/favorites/jokes/:jokeId')
      .put([jwtRequiredAuthentication], userController.addJokeToFavorite)
      .delete([jwtRequiredAuthentication], userController.removeJokeFromFavorite);

router.route('/jokes')
      .get([jwtRequiredAuthentication, paginationMiddleware], userController.getUserJokes);


router.route('/password')
      .post([jwtRequiredAuthentication],userController.changePassword);


export default router;