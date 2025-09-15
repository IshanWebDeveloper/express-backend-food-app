// Routes for Food
import { authMiddleware } from '@/middlewares/auth.middleware';
import { Router } from 'express';
import {
    createFoodController,
    deleteFoodController,
    getAllFoodController,
    getFoodController,
    updateFoodController,
} from './food.controller';
const foodRouter = Router();
// Define food routes here
foodRouter.get('/', authMiddleware, getAllFoodController);
foodRouter.post('/create', authMiddleware, createFoodController);
foodRouter.get('/:foodId', authMiddleware, getFoodController);
foodRouter.put('/:foodId', authMiddleware, updateFoodController);
foodRouter.delete('/:foodId', authMiddleware, deleteFoodController);
export default foodRouter;
