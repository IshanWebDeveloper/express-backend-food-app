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
categoryRouter.get('/', getAllCategoriesController);

// Get category by id
categoryRouter.get('/:categoryId', getCategoryController);

// Create category
categoryRouter.post('/', createCategoryController);

// Update category
categoryRouter.put('/:categoryId', updateCategoryController);

// Delete category
categoryRouter.delete('/:categoryId', deleteCategoryController);

export default categoryRouter;
