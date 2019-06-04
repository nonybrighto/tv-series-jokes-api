import express from 'express';
import usersRoutes from './users.route';
import userRoutes from './user.route';
import authRoutes from './auth.route';
import jokesRoutes from './jokes.route';
import moviesRoutes from './movies.route';

const router = express.Router(); 


router.use('/users', usersRoutes);
router.use('/user', userRoutes);
router.use('/auth', authRoutes);
router.use('/jokes', jokesRoutes);
router.use('/movies', moviesRoutes);

export default router;
