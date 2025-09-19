import { CustomError } from '@/utils/custom-error';
import { ReportRepo, Period } from './report.repo';
import {
    validateAOVQuery,
    validateSalesQuery,
    validateTopItemsQuery,
} from './report.validator';

export const getSalesByPeriodService = async (query: any) => {
    const { error, value } = validateSalesQuery(query);
    if (error) throw new CustomError(error.details[0].message, 400);
    const { period, startDate, endDate, status } = value;
    return await ReportRepo.getSalesByPeriod(
        period as Period,
        { startDate, endDate },
        status,
    );
};

export const getTopSellingItemsService = async (query: any) => {
    const { error, value } = validateTopItemsQuery(query);
    if (error) throw new CustomError(error.details[0].message, 400);
    const { metric, startDate, endDate, limit, status } = value;
    return await ReportRepo.getTopItems(
        metric,
        { startDate, endDate },
        limit,
        status,
    );
};

export const getAverageOrderValueService = async (query: any) => {
    const { error, value } = validateAOVQuery(query);
    if (error) throw new CustomError(error.details[0].message, 400);
    const { period, startDate, endDate, status } = value;
    return await ReportRepo.getAverageOrderValue(
        period as Period,
        { startDate, endDate },
        status,
    );
};
