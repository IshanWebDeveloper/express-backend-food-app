import CartRepo from './cart.repo';
import {
    validateGetCart,
    validateAddItem,
    validateRemoveItem,
    validateClearCart,
} from './cart.validator';
import { CustomError } from '../../utils/custom-error';

export const getCartService = async (params: any) => {
    const { error } = validateGetCart(params);
    if (error) {
        throw new CustomError(error.details[0].message, 400);
    }
    const { userId } = params;
    if (!userId || isNaN(Number(userId))) {
        throw new CustomError('Invalid or missing userId parameter', 400);
    }
    return await CartRepo.getCartWithItems(Number(userId));
};

export const addItemService = async (params: any) => {
    const { error } = validateAddItem(params);
    if (error) {
        throw new CustomError(error.details[0].message, 400);
    }
    const { userId, productId, quantity } = params;
    if (
        !userId ||
        isNaN(Number(userId)) ||
        !productId ||
        isNaN(Number(productId)) ||
        !quantity ||
        isNaN(Number(quantity))
    ) {
        throw new CustomError('Invalid or missing parameters', 400);
    }
    return await CartRepo.addOrUpdateCartItem(
        Number(userId),
        Number(productId),
        Number(quantity),
    );
};

export const removeItemService = async (params: any) => {
    const { error } = validateRemoveItem(params);
    if (error) {
        throw new CustomError(error.details[0].message, 400);
    }
    const { userId, productId } = params;
    if (
        !userId ||
        isNaN(Number(userId)) ||
        !productId ||
        isNaN(Number(productId))
    ) {
        throw new CustomError('Invalid or missing parameters', 400);
    }
    return await CartRepo.removeCartItem(Number(userId), Number(productId));
};

export const clearCartService = async (params: any) => {
    const { error } = validateClearCart(params);
    if (error) {
        throw new CustomError(error.details[0].message, 400);
    }
    const { userId } = params;
    if (!userId || isNaN(Number(userId))) {
        throw new CustomError('Invalid or missing userId parameter', 400);
    }
    return await CartRepo.clearCart(Number(userId));
};
