import { Router } from 'express';
import {
    getAllCategoriesController,
    getCategoryController,
    createCategoryController,
    updateCategoryController,
    deleteCategoryController,
} from './category.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';

const categoryRouter = Router();

// Get all categories
categoryRouter.get('/', authMiddleware, getAllCategoriesController);

// Get category by id
categoryRouter.get('/:categoryId', authMiddleware, getCategoryController);

// Create category
categoryRouter.post('/', authMiddleware, createCategoryController);

// Update category
categoryRouter.put('/:categoryId', authMiddleware, updateCategoryController);

// Delete category
categoryRouter.delete('/:categoryId', authMiddleware, deleteCategoryController);

export default categoryRouter;
