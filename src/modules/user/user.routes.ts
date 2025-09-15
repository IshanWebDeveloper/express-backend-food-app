import express from 'express';
import {
    getUserFavoriteFoodsController,
    getUserProfileController,
} from './user.controller';
import { authMiddleware } from '@/middlewares/auth.middleware';

const userRouter = express.Router();

userRouter.get('/profile', authMiddleware, getUserProfileController);
userRouter.get('/favorites', authMiddleware, getUserFavoriteFoodsController);

export default userRouter;
