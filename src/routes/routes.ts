import authRouter from '@/modules/auth/auth.routes';
import userRouter from '@/modules/user/user.routes';
import categoryRouter from '@/modules/category/category.routes';
import foodRouter from '@/modules/food/food.routes';
import orderRouter from '@/modules/order/order.routes';
import express from 'express';
import { authMiddleware } from '@/middlewares/auth.middleware';
import reportRouter from '@/modules/reporting/report.routes';

const router = express.Router();

router.use('/auth', authRouter);
router.use('/user', authMiddleware, userRouter);
router.use('/categories', authMiddleware, categoryRouter);
router.use('/foods', authMiddleware, foodRouter);
router.use('/orders', authMiddleware, orderRouter);
router.use('/reports', authMiddleware, reportRouter);

export default router;
