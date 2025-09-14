import express from 'express';
import {
    refreshTokenController,
    signInController,
    signOutController,
    signUpController,
} from './auth.controller';

const authRouter = express.Router();

authRouter.post('/signup', signUpController);
authRouter.post('/signin', signInController);
authRouter.post('/signout', signOutController);
authRouter.post('/refresh-token', refreshTokenController);

export default authRouter;
