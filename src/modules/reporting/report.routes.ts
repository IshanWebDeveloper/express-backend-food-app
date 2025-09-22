import express from 'express';
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

//average order value by period
// GET /reports/aov?period=day|week|month&startDate=&endDate=&status=
reportRouter.get('/aov', getAverageOrderValueController);

export default reportRouter;
