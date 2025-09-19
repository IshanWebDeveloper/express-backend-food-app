import { Router } from 'express';
import {
    getAllOrdersController,
    createOrderController,
} from './order.controller';

const router = Router();

router.get('/', getAllOrdersController);
router.post('/create', createOrderController);

export default router;
