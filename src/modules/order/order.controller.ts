import { Request, Response, NextFunction } from 'express';
import {
    createOrderService,
    getAllOrdersService,
    updateOrderService,
    updateOrderStatusService,
} from './order.service';

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

export const updateOrderStatusController = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        if (!orderId || !status) {
            throw new Error('Order ID and status are required');
        }
        await updateOrderStatusService(orderId, status);
        res.status(200).json({ message: 'Order status updated' });
    } catch (error) {
        next(error);
    }
};

export const updateOrderController = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { orderId } = req.params;
        const { items } = req.body;
        if (!orderId) {
            throw new Error('Order ID is required');
        }
        const order = await updateOrderService(orderId, items);
        res.status(200).json({ order });
    } catch (error) {
        next(error);
    }
};
