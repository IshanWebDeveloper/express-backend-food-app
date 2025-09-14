import { Request, Response, NextFunction } from 'express';
import {
    getAllCategoriesService,
    getCategoryService,
    createCategoryService,
    updateCategoryService,
    deleteCategoryService,
} from './category.service';
export const getCategoryController = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const category = await getCategoryService(req.params);
        res.status(200).json(category);
    } catch (error) {
        next(error);
    }
};

export const getAllCategoriesController = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const categories = await getAllCategoriesService();
        res.status(200).json(categories);
    } catch (error) {
        next(error);
    }
};

export const createCategoryController = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const category = await createCategoryService(req.body);
        res.status(201).json(category);
    } catch (error) {
        next(error);
    }
};

export const updateCategoryController = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const updatedCategory = await updateCategoryService({
            ...req.params,
            ...req.body,
        });
        res.status(200).json(updatedCategory);
    } catch (error) {
        next(error);
    }
};

export const deleteCategoryController = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        await deleteCategoryService(req.params);
        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        next(error);
    }
};
