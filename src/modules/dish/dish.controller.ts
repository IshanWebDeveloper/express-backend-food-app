import { Request, Response, NextFunction } from 'express';
import {
    createDishService,
    deleteDishService,
    getAllDishesService,
    getDishesByCategoryService,
    getDishService,
    updateDishService,
} from './dish.service';
import {
    getAllCategoriesService,
    getCategoryService,
} from '../category/category.service';

export const createDishController = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const dish = await createDishService(req.body);
        res.status(201).json({
            message: 'Successfully created dish',
            data: dish,
        });
    } catch (error) {
        next(error);
    }
};

export const getAllDishesController = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const dishes = await getAllDishesService();
        res.status(200).json(dishes);
    } catch (error) {
        next(error);
    }
};

export const getAllDishesByCategory = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const dishes = await getAllDishesService();
        const categories = await getAllCategoriesService();

        const categorizedDishes: { [key: string]: any[] } = {};
        categories.forEach(category => {
            categorizedDishes[category.name] = [];
        });

        dishes.forEach(dish => {
            const category = categories.find(
                cat => cat.id === dish.category_id,
            );
            if (category) {
                categorizedDishes[category.name].push(dish);
            }
        });

        res.status(200).json({
            data: Object.keys(categorizedDishes).map(categoryName => ({
                title: categoryName,
                data: categorizedDishes[categoryName],
            })),
        });
    } catch (error) {
        next(error);
    }
};

export const getDishesByCategoryController = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const categoryName = await getCategoryService(req.params);

        const dishes = await getDishesByCategoryService(req.params.categoryid);
        res.status(200).json({
            category: categoryName?.name || 'Unknown Category',
            dishes,
        });
    } catch (error) {
        next(error);
    }
};

export const getDishController = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const dish = await getDishService(req.params);
        res.status(200).json(dish);
    } catch (error) {
        next(error);
    }
};

export const updateDishController = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const updatedDish = await updateDishService({
            ...req.params,
            ...req.body,
        });
        res.status(200).json(updatedDish);
    } catch (error) {
        next(error);
    }
};

export const deleteDishController = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        await deleteDishService(req.params);
        res.status(200).json({ message: 'Dish deleted successfully' });
    } catch (error) {
        next(error);
    }
};
