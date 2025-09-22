import { Dish } from '../../interfaces/dish.interfaces';
import { DishRepo } from './dish.repo';
import {
    validateCreateFood,
    validateGetFood,
    validateUpdateFood,
    validateDeleteFood,
} from './dish.validator';
import { CustomError } from '@/utils/custom-error';

export const createDishService = async (data: Dish) => {
    const { error } = validateCreateFood(data);
    if (error) {
        throw new CustomError(error.details[0].message, 400);
    }
    return await DishRepo.create(data);
};

export const getAllDishesService = async () => {
    return await DishRepo.findAll();
};

export const getDishesByCategoryService = async (categoryId: string) => {
    // const { error } = validateGetFood(params);
    // if (error) {
    //     throw new CustomError(error.details[0].message, 400);
    // }

    if (!categoryId) {
        throw new CustomError('Invalid or missing categoryId parameter', 400);
    }
    return await DishRepo.findByCategory(categoryId);
};

export const getDishService = async (params: any) => {
    const { error } = validateGetFood(params);
    if (error) {
        throw new CustomError(error.details[0].message, 400);
    }
    const { dishid } = params;
    if (!dishid) {
        throw new CustomError('Invalid or missing foodId parameter', 400);
    }
    return await DishRepo.findById(dishid);
};

export const updateDishService = async (params: any) => {
    const { error } = validateUpdateFood(params);
    if (error) {
        throw new CustomError(error.details[0].message, 400);
    }
    const { dishid, ...updateData } = params;
    if (!dishid) {
        throw new CustomError('Invalid or missing dishId parameter', 400);
    }
    return await DishRepo.update(dishid, updateData);
};

export const deleteDishService = async (params: any) => {
    const { error } = validateDeleteFood(params);
    if (error) {
        throw new CustomError(error.details[0].message, 400);
    }
    const { foodId } = params;
    if (!foodId) {
        throw new CustomError('Invalid or missing foodId parameter', 400);
    }
    return await DishRepo.delete(foodId);
};

export const getDishPrices = async (ids: string[]) => {
    return await DishRepo.findAll().then(dishes =>
        dishes.filter(dish => dish.id !== undefined && ids.includes(dish.id)),
    );
};
