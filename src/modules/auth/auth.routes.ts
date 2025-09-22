import express from 'express';
import {
    oauthSignInController,
    refreshTokenController,
    signInController,
    signOutController,
    signUpController,
    updateUserController,
} from './auth.controller';
import { authMiddleware } from '@/middlewares/auth.middleware';

const authRouter = express.Router();

authRouter.post('/signup', signUpController);
authRouter.post('/signin', signInController);
authRouter.post('/oauth/google', oauthSignInController); // Google OAuth sign-in route
authRouter.post('/signout', signOutController);
authRouter.post('/refresh-token', refreshTokenController);
authRouter.put('/edit-profile/:userId', updateUserController);

export default authRouter;
