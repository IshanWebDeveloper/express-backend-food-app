import { Food } from '../../interfaces/food.interfaces';
import { FoodRepo } from './food.repo';
import {
    validateCreateFood,
    validateGetFood,
    validateUpdateFood,
    validateDeleteFood,
} from './food.validator';
import { CustomError } from '@/utils/custom-error';

export const createFoodService = async (data: Food) => {
    const { error } = validateCreateFood(data);
    if (error) {
        throw new CustomError(error.details[0].message, 400);
    }
    return await FoodRepo.create(data);
};

export const getAllFoodService = async () => {
    return await FoodRepo.findAll();
};

export const getFoodService = async (params: any) => {
    const { error } = validateGetFood(params);
    if (error) {
        throw new CustomError(error.details[0].message, 400);
    }
    const { foodId } = params;
    if (!foodId) {
        throw new CustomError('Invalid or missing foodId parameter', 400);
    }
    return await FoodRepo.findById(foodId);
};

export const updateFoodService = async (params: any) => {
    const { error } = validateUpdateFood(params);
    if (error) {
        throw new CustomError(error.details[0].message, 400);
    }
    const { foodId, ...updateData } = params;
    if (!foodId) {
        throw new CustomError('Invalid or missing foodId parameter', 400);
    }
    return await FoodRepo.update(foodId, updateData);
};

export const deleteFoodService = async (params: any) => {
    const { error } = validateDeleteFood(params);
    if (error) {
        throw new CustomError(error.details[0].message, 400);
    }
    const { foodId } = params;
    if (!foodId) {
        throw new CustomError('Invalid or missing foodId parameter', 400);
    }
    return await FoodRepo.delete(foodId);
};
