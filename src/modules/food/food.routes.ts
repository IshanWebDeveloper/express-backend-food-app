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
foodRouter.get('/', getAllFoodController);
foodRouter.post('/create', createFoodController);
foodRouter.get('/:foodId', getFoodController);
foodRouter.put('/:foodId', updateFoodController);
foodRouter.delete('/:foodId', deleteFoodController);
export default foodRouter;
