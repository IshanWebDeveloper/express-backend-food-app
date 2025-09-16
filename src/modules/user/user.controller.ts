import { NextFunction, Request, Response } from 'express';
import {
    addUserFavoriteFoodService,
    getUserFavoriteFoodsService,
    getUserProfileService,
    isFoodFavoriteService,
    removeUserFavoriteFoodService,
} from './user.service';
import { validateAddFavoriteFood } from './user.validator';

export const getUserProfileController = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const authorization = req.headers.authorization;
        if (!authorization) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        const accessToken = authorization.split(' ')[1];
        const response = await getUserProfileService(accessToken);

        res.status(200).json({ message: 'User data fetched', data: response });
    } catch (error) {
        next(error);
    }
};

export const getUserFavoriteFoodsController = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const authorization = req.headers.authorization;
        if (!authorization) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        const accessToken = authorization.split(' ')[1];
        const response = await getUserFavoriteFoodsService(accessToken);

        res.status(200).json({
            message: 'User favorite foods fetched',
            data: response,
        });
    } catch (error) {
        next(error);
    }
};

export const addUserFavoriteFoodController = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const authorization = req.headers.authorization;
        if (!authorization) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        const accessToken = authorization.split(' ')[1];
        const { foodId } = req.body;
        const { error } = validateAddFavoriteFood({ foodId });
        if (error) {
            res.status(400).json({ message: error.details[0].message });
            return;
        }
        const response = await addUserFavoriteFoodService(accessToken, foodId);
        res.status(201).json({
            message: 'User favorite food added',
            data: response,
        });
    } catch (error) {
        next(error);
    }
};

export const removeUserFavoriteFoodController = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const authorization = req.headers.authorization;
        if (!authorization) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        const accessToken = authorization.split(' ')[1];
        const { foodId } = req.body;
        const response = await removeUserFavoriteFoodService(
            accessToken,
            foodId,
        );
        res.status(200).json({
            message: 'User favorite food removed',
            data: response,
        });
    } catch (error) {
        next(error);
    }
};

export const isFoodFavoriteController = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const authorization = req.headers.authorization;
        if (!authorization) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        const accessToken = authorization.split(' ')[1];
        const { foodId } = req.body;
        const response = await isFoodFavoriteService(accessToken, foodId);
        res.status(200).json({
            message: 'User favorite food status fetched',
            data: response,
        });
    } catch (error) {
        next(error);
    }
};
