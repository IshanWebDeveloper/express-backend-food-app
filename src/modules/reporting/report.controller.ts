import { Request, Response, NextFunction } from 'express';
import {
    getAverageOrderValueService,
    getSalesByPeriodService,
    getTopSellingItemsService,
} from './report.service';

export const getSalesByPeriodController = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const data = await getSalesByPeriodService(req.query);
        res.json({ success: true, data });
    } catch (err) {
        next(err);
    }
};

export const getTopSellingItemsController = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const data = await getTopSellingItemsService(req.query);
        res.json({ success: true, data });
    } catch (err) {
        next(err);
    }
};

export const getAverageOrderValueController = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const data = await getAverageOrderValueService(req.query);
        res.json({ success: true, data });
    } catch (err) {
        next(err);
    }
};
