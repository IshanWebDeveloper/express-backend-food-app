import express from 'express';
import {
    addUserFavoriteFoodController,
    getUserFavoriteFoodsController,
    getUserProfileController,
    isFoodFavoriteController,
    removeUserFavoriteFoodController,
} from './user.controller';
import { authMiddleware } from '@/middlewares/auth.middleware';

const userRouter = express.Router();

userRouter.get('/profile', authMiddleware, getUserProfileController);
userRouter.get('/favorites', authMiddleware, getUserFavoriteFoodsController);
userRouter.post('/favorites', authMiddleware, addUserFavoriteFoodController);
userRouter.post(
    '/favorites/remove',
    authMiddleware,
    removeUserFavoriteFoodController,
);
userRouter.post(
    '/favorites/is-favorite',
    authMiddleware,
    isFoodFavoriteController,
);

export default userRouter;
