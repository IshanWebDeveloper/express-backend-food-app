import { NextFunction, Request, Response } from 'express';
import {
    logoutService,
    refreshTokenService,
    signInService,
    signUpService,
    updateUserService,
} from './auth.service';

export const signUpController = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const userData = req.body;
        const response = await signUpService(userData);

        res.status(201).json({
            message: 'Successfully signed up',
            data: response,
        });
    } catch (error) {
        next(error);
    }
};

export const signInController = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const userData = req.body;
        const response = await signInService(userData);

        res.status(200).json({
            message: 'Successfully signed in',
            data: response,
        });
    } catch (error) {
        next(error);
    }
};

export const signOutController = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { userId } = req.body;
        await logoutService(userId);
        res.status(200).json({
            message: 'Successfully signed out',
        });
    } catch (error) {
        next(error);
    }
};

export const refreshTokenController = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { refresh_token } = req.body;
        const response = await refreshTokenService(refresh_token);
        res.status(200).json({
            message: 'Successfully refreshed token',
            data: response,
        });
    } catch (error) {
        next(error);
    }
};

// update user details controller
export const updateUserController = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { userId } = req.params;
        const updateData = req.body;
        const response = await updateUserService(userId, updateData);
        res.status(200).json({
            message: 'Successfully updated user',
            data: response,
        });
    } catch (error) {
        next(error);
    }
};
