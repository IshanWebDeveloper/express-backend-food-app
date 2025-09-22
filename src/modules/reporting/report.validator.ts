import { z } from 'zod';

type JoiLikeError = { details: Array<{ message: string }> };
type ValidationResult<T> = { value?: T; error?: JoiLikeError };

const toValidationResult = <T>(res: any): ValidationResult<T> => {
    if (res.success) return { value: res.data };
    const issue = res.error?.errors?.[0];
    const message = issue?.message || 'Validation error';
    return { error: { details: [{ message }] } };
};

const isoDateString = z
    .string()
    .refine(val => !val || !Number.isNaN(Date.parse(val)), {
        message: 'Date must be an ISO 8601 string',
    });

export const validateSalesQuery = (query: any): ValidationResult<any> => {
    const schema = z.object({
        period: z.enum(['day', 'week', 'month']).default('day'),
        startDate: isoDateString.optional(),
        endDate: isoDateString.optional(),
        status: z.union([z.string(), z.array(z.string())]).optional(),
    });
    return toValidationResult(schema.safeParse(query));
};

export const validateTopItemsQuery = (query: any): ValidationResult<any> => {
    const schema = z.object({
        metric: z.enum(['quantity', 'revenue']).default('quantity'),
        startDate: isoDateString.optional(),
        endDate: isoDateString.optional(),
        limit: z.coerce.number().int().min(1).max(100).default(10),
        status: z.union([z.string(), z.array(z.string())]).optional(),
    });
    return toValidationResult(schema.safeParse(query));
};

export const validateAOVQuery = (query: any): ValidationResult<any> => {
    const schema = z.object({
        period: z.enum(['day', 'week', 'month']).default('day'),
        startDate: isoDateString.optional(),
        endDate: isoDateString.optional(),
        status: z.union([z.string(), z.array(z.string())]).optional(),
    });
    return toValidationResult(schema.safeParse(query));
};
