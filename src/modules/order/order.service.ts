import { OrderRepo } from './order.repo';
import { CustomError } from '@/utils/custom-error';
import { validateCreateOrder } from './order.validator';
import { getDishPrices } from '../dish/dish.service';
import { OrderStatus } from '@/database/models/order.model';
// import validators as needed (assume validateCreateOrder, etc. exist)

export const createOrderService = async (
    userId: string,
    items: Array<{ productId: string; quantity: number }>,
) => {
    const { error } = validateCreateOrder({ items });
    if (error) {
        throw new CustomError(error.details[0].message, 400);
    }
    if (!Array.isArray(items) || items.length === 0) {
        throw new CustomError('Order must have at least one item', 400);
    }
    // Fetch dish prices and validate
    const dishIds = items.map(i => i.productId);
    const dishes = await getDishPrices(dishIds);
    if (dishes.length !== items.length) {
        throw new CustomError('Some dishes not found', 400);
    }
    // Calculate total
    let totalAmount = 0;
    const orderItems = items.map(item => {
        const dish = dishes.find((d: any) => d.id === item.productId);
        if (!dish) throw new CustomError('Dish not found', 400);
        const price = dish.price;
        totalAmount += price * item.quantity;
        return { productId: item.productId, quantity: item.quantity, price };
    });
    // Transactional create (assume transaction handled in repo)
    return await OrderRepo.create(userId, orderItems, totalAmount);
};

export const getAllOrdersService = async (userId: string) => {
    if (!userId) throw new CustomError('User not authenticated', 401);
    return await OrderRepo.findAllByUser(userId);
};

export const updateOrderService = async (
    orderId: string,
    items: Array<{ productId: string; quantity: number }>,
) => {
    const { error } = validateCreateOrder({ items });
    if (error) {
        throw new CustomError(error.details[0].message, 400);
    }
    if (!orderId) {
        throw new CustomError('Order ID is required', 400);
    }
    if (!Array.isArray(items) || items.length === 0) {
        throw new CustomError('Order must have at least one item', 400);
    }
    // Fetch dish prices and validate
    const dishIds = items.map(i => i.productId);
    const dishes = await getDishPrices(dishIds);
    if (dishes.length !== items.length) {
        throw new CustomError('Some dishes not found', 400);
    }
    // Calculate total
    let totalAmount = 0;
    const orderItems = items.map(item => {
        const dish = dishes.find((d: any) => d.id === item.productId);
        if (!dish) throw new CustomError('Dish not found', 400);
        const price = dish.price;
        totalAmount += price * item.quantity;
        return { productId: item.productId, quantity: item.quantity, price };
    });
    // Transactional update (assume transaction handled in repo)
    return await OrderRepo.update(orderId, orderItems, totalAmount);
};

export const updateOrderStatusService = async (
    orderId: string,
    status: OrderStatus,
) => {
    if (!orderId || !status) {
        throw new CustomError('Order ID and status are required', 400);
    }
    return await OrderRepo.updateStatus(orderId, status);
};
