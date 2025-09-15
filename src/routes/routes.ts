import authRouter from '@/modules/auth/auth.routes';
import cartRouter from '@/modules/cart/cart.routes';
import userRouter from '@/modules/user/user.routes';
import categoryRouter from '@/modules/category/category.routes';
import foodRouter from '@/modules/food/food.routes';
import express from 'express';

const router = express.Router();

router.use('/auth', authRouter);
router.use('/user', userRouter);
router.use('/cart', cartRouter);
router.use('/categories', categoryRouter);
router.use('/foods', foodRouter);

export default router;
