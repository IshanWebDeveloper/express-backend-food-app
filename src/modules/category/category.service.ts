import CategoryRepo from './category.repo';
import {
    validateGetCategory,
    validateCreateCategory,
    validateUpdateCategory,
    validateDeleteCategory,
} from './category.validator';
import { CustomError } from '../../utils/custom-error';

export const getAllCategoriesService = async () => {
    return await CategoryRepo.findAll();
};

export const getCategoryService = async (params: any) => {
    const { error } = validateGetCategory(params);
    if (error) {
        throw new CustomError(error.details[0].message, 400);
    }
    const { categoryId } = params;
    if (!categoryId || isNaN(Number(categoryId))) {
        throw new CustomError('Invalid or missing categoryId parameter', 400);
    }
    return await CategoryRepo.findById(Number(categoryId));
};

export const createCategoryService = async (data: any) => {
    const { error } = validateCreateCategory(data);
    if (error) {
        throw new CustomError(error.details[0].message, 400);
    }
    return await CategoryRepo.create(data);
};

export const updateCategoryService = async (params: any) => {
    const { error } = validateUpdateCategory(params);
    if (error) {
        throw new CustomError(error.details[0].message, 400);
    }
    const { categoryId, ...updateData } = params;
    if (!categoryId || isNaN(Number(categoryId))) {
        throw new CustomError('Invalid or missing categoryId parameter', 400);
    }
    return await CategoryRepo.update(Number(categoryId), updateData);
};

export const deleteCategoryService = async (params: any) => {
    const { error } = validateDeleteCategory(params);
    if (error) {
        throw new CustomError(error.details[0].message, 400);
    }
    const { categoryId } = params;
    if (!categoryId || isNaN(Number(categoryId))) {
        throw new CustomError('Invalid or missing categoryId parameter', 400);
    }
    return await CategoryRepo.delete(Number(categoryId));
};
