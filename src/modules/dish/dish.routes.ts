import { Router } from 'express';
import {
    createDishController,
    deleteDishController,
    getAllDishesController,
    getAllDishesByCategory,
    getDishController,
    getDishesByCategoryController,
    updateDishController,
} from './dish.controller';

const dishRouter = Router();
// Define dish routes here
dishRouter.get('/', getAllDishesController);
dishRouter.get('/with-category', getAllDishesByCategory);
dishRouter.get('/category/:categoryid', getDishesByCategoryController);
dishRouter.post('/create', createDishController);
dishRouter.get('/:dishid', getDishController);
dishRouter.put('/:dishid', updateDishController);
dishRouter.delete('/:dishid', deleteDishController);
export default dishRouter;
