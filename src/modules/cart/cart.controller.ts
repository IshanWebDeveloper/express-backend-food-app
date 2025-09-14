import { Request, Response, NextFunction } from 'express';
import {
    getCartService,
    addItemService,
    removeItemService,
    clearCartService,
} from './cart.service';

export const getCartController = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const cart = await getCartService(req.params);
        res.status(200).json(cart);
    } catch (error) {
        next(error);
    }
};

export const addItemController = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const updatedCart = await addItemService(req.params);
        res.status(200).json(updatedCart);
    } catch (error) {
        next(error);
    }
};

export const removeItemController = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const updatedCart = await removeItemService(req.params);
        res.status(200).json(updatedCart);
    } catch (error) {
        next(error);
    }
};

export const clearCartController = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        await clearCartService(req.params);
        res.status(200).json({ message: 'Cart cleared successfully' });
    } catch (error) {
        next(error);
    }
};
