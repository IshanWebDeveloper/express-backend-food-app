import { Router } from 'express';
import {
    getAllOrdersController,
    createOrderController,
} from './order.controller';
import { authMiddleware } from '@/middlewares/auth.middleware';

const router = Router();

router.get('/', authMiddleware, getAllOrdersController);
router.post('/create', authMiddleware, createOrderController);

export default router;
