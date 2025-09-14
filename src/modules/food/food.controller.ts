import { Request, Response, NextFunction } from 'express';
import {
    createFoodService,
    getAllFoodService,
    getFoodService,
    updateFoodService,
    deleteFoodService,
} from './food.service';

export const createFoodController = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const food = await createFoodService(req.body);
        res.status(201).json({
            message: 'Successfully created food',
            data: food,
        });
    } catch (error) {
        next(error);
    }
};

export const getAllFoodController = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const foods = await getAllFoodService();
        res.status(200).json(foods);
    } catch (error) {
        next(error);
    }
};

export const getFoodController = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const food = await getFoodService(req.params);
        res.status(200).json(food);
    } catch (error) {
        next(error);
    }
};

export const updateFoodController = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const updatedFood = await updateFoodService({
            ...req.params,
            ...req.body,
        });
        res.status(200).json(updatedFood);
    } catch (error) {
        next(error);
    }
};

export const deleteFoodController = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        await deleteFoodService(req.params);
        res.status(200).json({ message: 'Food deleted successfully' });
    } catch (error) {
        next(error);
    }
};
