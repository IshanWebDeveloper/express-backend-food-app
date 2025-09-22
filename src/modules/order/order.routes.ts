import { Router } from 'express';
import {
    getAllOrdersController,
    createOrderController,
    updateOrderController,
    updateOrderStatusController,
} from './order.controller';

const router = Router();

router.get('/', getAllOrdersController);
router.post('/create', createOrderController);
router.put('/update/:orderId', updateOrderController);
router.patch('/status/:orderId', updateOrderStatusController);

export default router;
