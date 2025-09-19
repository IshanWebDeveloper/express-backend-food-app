import express from 'express';
import {
    addUserFavoriteFoodController,
    getUserFavoriteFoodsController,
    getUserProfileController,
    isFoodFavoriteController,
    removeUserFavoriteFoodController,
} from './user.controller';

const userRouter = express.Router();

userRouter.get('/profile', getUserProfileController);
userRouter.get('/favorites', getUserFavoriteFoodsController);
userRouter.post('/favorites', addUserFavoriteFoodController);
userRouter.post('/favorites/remove', removeUserFavoriteFoodController);
userRouter.post('/favorites/is-favorite', isFoodFavoriteController);

export default userRouter;
