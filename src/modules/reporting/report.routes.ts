import express from 'express';
import { authMiddleware } from '@/middlewares/auth.middleware';
import {
    getAverageOrderValueController,
    getSalesByPeriodController,
    getTopSellingItemsController,
} from './report.controller';

const reportRouter = express.Router();

// GET /reports/sales?period=day|week|month&startDate=&endDate=&status=delivered,confirmed
reportRouter.get('/sales', getSalesByPeriodController);

// GET /reports/top-items?metric=quantity|revenue&startDate=&endDate=&limit=&status=
reportRouter.get('/top-items', getTopSellingItemsController);

// GET /reports/aov?period=day|week|month&startDate=&endDate=&status=
reportRouter.get('/aov', getAverageOrderValueController);

export default reportRouter;
