import {
    getAverageOrderValueService,
    getSalesByPeriodService,
    getTopSellingItemsService,
} from '../../../src/modules/reporting/report.service';
import { ReportRepo } from '../../../src/modules/reporting/report.repo';
import {
    validateAOVQuery,
    validateSalesQuery,
    validateTopItemsQuery,
} from '../../../src/modules/reporting/report.validator';
import { CustomError } from '../../../src/utils/custom-error';

jest.mock('../../../src/modules/reporting/report.repo', () => ({
    ReportRepo: {
        getSalesByPeriod: jest.fn(),
        getTopItems: jest.fn(),
        getAverageOrderValue: jest.fn(),
    },
}));

jest.mock('../../../src/modules/reporting/report.validator', () => ({
    validateAOVQuery: jest.fn(() => ({
        error: null,
        value: { period: 'day' },
    })),
    validateSalesQuery: jest.fn(() => ({
        error: null,
        value: { period: 'day' },
    })),
    validateTopItemsQuery: jest.fn(() => ({
        error: null,
        value: { metric: 'quantity', limit: 10 },
    })),
}));

describe('reporting.service', () => {
    beforeEach(() => jest.clearAllMocks());

    it('getSalesByPeriodService validates and calls repo', async () => {
        (ReportRepo.getSalesByPeriod as jest.Mock).mockResolvedValue([
            { period: '2025-09-22', total_sales: '100' },
        ]);
        const res = await getSalesByPeriodService({});
        expect(validateSalesQuery).toHaveBeenCalled();
        expect(ReportRepo.getSalesByPeriod).toHaveBeenCalled();
        expect(res).toEqual([{ period: '2025-09-22', total_sales: '100' }]);
    });

    it('getSalesByPeriodService throws on validation error', async () => {
        (validateSalesQuery as jest.Mock).mockReturnValueOnce({
            error: { details: [{ message: 'bad' }] },
        });
        await expect(getSalesByPeriodService({})).rejects.toThrow(
            new CustomError('bad', 400),
        );
    });

    it('getTopSellingItemsService validates and calls repo', async () => {
        (ReportRepo.getTopItems as jest.Mock).mockResolvedValue([
            { dish_id: 'd', name: 'Dish', value: '5' },
        ]);
        const res = await getTopSellingItemsService({});
        expect(validateTopItemsQuery).toHaveBeenCalled();
        expect(ReportRepo.getTopItems).toHaveBeenCalled();
        expect(res).toEqual([{ dish_id: 'd', name: 'Dish', value: '5' }]);
    });

    it('getTopSellingItemsService throws on validation error', async () => {
        (validateTopItemsQuery as jest.Mock).mockReturnValueOnce({
            error: { details: [{ message: 'bad' }] },
        });
        await expect(getTopSellingItemsService({})).rejects.toThrow(
            new CustomError('bad', 400),
        );
    });

    it('getAverageOrderValueService validates and calls repo', async () => {
        (ReportRepo.getAverageOrderValue as jest.Mock).mockResolvedValue([
            { period: '2025-09', average_order_value: '20' },
        ]);
        const res = await getAverageOrderValueService({});
        expect(validateAOVQuery).toHaveBeenCalled();
        expect(ReportRepo.getAverageOrderValue).toHaveBeenCalled();
        expect(res).toEqual([{ period: '2025-09', average_order_value: '20' }]);
    });

    it('getAverageOrderValueService throws on validation error', async () => {
        (validateAOVQuery as jest.Mock).mockReturnValueOnce({
            error: { details: [{ message: 'bad' }] },
        });
        await expect(getAverageOrderValueService({})).rejects.toThrow(
            new CustomError('bad', 400),
        );
    });
});
