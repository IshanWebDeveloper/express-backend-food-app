import { Request, Response, NextFunction } from 'express';
import { createOrderService, getAllOrdersService } from './order.service';

export const getAllOrdersController = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const userId = req.context?.userId;
        if (!userId) throw new Error('User not authenticated');
        const orders = await getAllOrdersService(userId);
        res.status(200).json({ orders });
    } catch (error) {
        next(error);
    }
};

export const createOrderController = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const userId = req.context?.userId;
        if (!userId) throw new Error('User not authenticated');
        const { items } = req.body;
        const order = await createOrderService(userId, items);
        res.status(201).json({ order });
    } catch (error) {
        next(error);
    }
};
