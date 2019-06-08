import express from 'express';
import validate  from 'express-validation';
import userController from '../controllers/user.controller';
import {jwtRequiredAuthentication} from '../middlewares/auth_middleware';
import paginationMiddleware from '../middlewares/pagination_middleware';
import FileUploader from '../helpers/file_uploader';
import userValidator from '../../app/middlewares/validators/user_validator'

const router = express.Router();
const fileUploader = new FileUploader();


router.route('/')
      .get([jwtRequiredAuthentication], userController.getCurrentUser);
router.route('/favorites/jokes')
      .get([jwtRequiredAuthentication, paginationMiddleware], userController.getFavoriteJokes);
router.route('/photo')
      .put([jwtRequiredAuthentication, fileUploader.imageUploadMiddleWare()], userController.changeProfilePhoto);
           

router.route('/favorites/jokes/:jokeId')
      .put([jwtRequiredAuthentication], userController.addJokeToFavorite)
      .delete([jwtRequiredAuthentication], userController.removeJokeFromFavorite);

router.route('/jokes')
      .get([jwtRequiredAuthentication, paginationMiddleware], userController.getUserJokes);


router.route('/password')
      .post([validate(userValidator.changePassword),jwtRequiredAuthentication],userController.changePassword);


export default router;