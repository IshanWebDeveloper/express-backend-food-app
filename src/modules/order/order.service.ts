import { OrderRepo } from './order.repo';
import { CustomError } from '@/utils/custom-error';
import { validateCreateOrder } from './order.validator';
import { getProductPrices } from '../food/food.service';
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
    // Fetch product prices and validate
    const productIds = items.map(i => i.productId);
    const products = await getProductPrices(productIds);
    if (products.length !== items.length) {
        throw new CustomError('Some products not found', 400);
    }
    // Calculate total
    let totalAmount = 0;
    const orderItems = items.map(item => {
        const product = products.find((p: any) => p.id === item.productId);
        if (!product) throw new CustomError('Product not found', 400);
        const price = product.price;
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
