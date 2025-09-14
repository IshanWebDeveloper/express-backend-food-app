import express from 'express';
import {
    refreshTokenController,
    signInController,
    signOutController,
    signUpController,
    updateUserController,
} from './auth.controller';

const authRouter = express.Router();

authRouter.post('/signup', signUpController);
authRouter.post('/signin', signInController);
authRouter.post('/signout', signOutController);
authRouter.post('/refresh-token', refreshTokenController);
authRouter.put('/edit-profile', updateUserController);

export default authRouter;
