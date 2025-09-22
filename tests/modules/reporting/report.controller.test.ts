import { Request, Response, NextFunction } from 'express';
import {
    getAverageOrderValueController,
    getSalesByPeriodController,
    getTopSellingItemsController,
} from '../../../src/modules/reporting/report.controller';
import * as reportService from '../../../src/modules/reporting/report.service';

jest.mock('../../../src/modules/reporting/report.service');

describe('reporting.controller', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
        req = { query: {} };
        res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;
        next = jest.fn();
        jest.clearAllMocks();
    });

    it('getSalesByPeriodController returns json success', async () => {
        (reportService.getSalesByPeriodService as jest.Mock).mockResolvedValue([
            { period: '2025-09-01' },
        ]);
        await getSalesByPeriodController(req as Request, res as Response, next);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            data: [{ period: '2025-09-01' }],
        });
    });

    it('getSalesByPeriodController forwards error', async () => {
        const err = new Error('x');
        (reportService.getSalesByPeriodService as jest.Mock).mockRejectedValue(
            err,
        );
        await getSalesByPeriodController(req as Request, res as Response, next);
        expect(next).toHaveBeenCalledWith(err);
    });

    it('getTopSellingItemsController returns json success', async () => {
        (
            reportService.getTopSellingItemsService as jest.Mock
        ).mockResolvedValue([{ dish_id: 'd' }]);
        await getTopSellingItemsController(
            req as Request,
            res as Response,
            next,
        );
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            data: [{ dish_id: 'd' }],
        });
    });

    it('getAverageOrderValueController returns json success', async () => {
        (
            reportService.getAverageOrderValueService as jest.Mock
        ).mockResolvedValue([{ period: '2025-09' }]);
        await getAverageOrderValueController(
            req as Request,
            res as Response,
            next,
        );
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            data: [{ period: '2025-09' }],
        });
    });
});
