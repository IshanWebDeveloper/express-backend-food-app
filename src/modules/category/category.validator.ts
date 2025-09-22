import { z } from 'zod';

type JoiLikeError = { details: Array<{ message: string }> };
type ValidationResult<T> = { value?: T; error?: JoiLikeError };

const requiredMessages: Record<string, string> = {
    categoryId: 'categoryId is required',
    categoryid: 'categoryId is required',
    name: 'name is required',
};

const toValidationResult = <T>(res: any): ValidationResult<T> => {
    if (res.success) return { value: res.data };
    const issue = res.error?.errors?.[0];
    let message = issue?.message || 'Validation error';
    if (
        issue?.code === 'invalid_type' &&
        (issue as any).received === 'undefined' &&
        Array.isArray(issue.path) &&
        issue.path.length > 0
    ) {
        const key = String(issue.path[0]);
        message = requiredMessages[key] || message;
    }
    return { error: { details: [{ message }] } };
};

export const validateGetCategory = (params: any) => {
    const schema = z.object({
        categoryid: z.uuid({ message: 'categoryId must be a valid UUID' }),
    });
    const res = schema.safeParse(params);
    if (!res.success) {
        return {
            error: {
                details: [
                    {
                        message:
                            'categoryId is required and must be a valid UUID',
                    },
                ],
            },
        };
    }
    return { value: res.data };
};

export const validateCreateCategory = (params: any) => {
    const schema = z.object({
        name: z
            .string()
            .min(1, { message: 'name cannot be empty' })
            .max(100, { message: 'name must be at most 100 characters' }),
        description: z
            .string()
            .max(255, { message: 'description must be at most 255 characters' })
            .optional()
            .or(z.literal('')),
    });
    const res = schema.safeParse(params);
    if (!res.success) return toValidationResult(res);
    return { value: res.data };
};

export const validateUpdateCategory = (params: any) => {
    const schema = z.object({
        categoryId: z.uuid({ message: 'categoryId must be a valid UUID' }),
        name: z
            .string()
            .min(1, { message: 'name cannot be empty' })
            .max(100, { message: 'name must be at most 100 characters' })
            .optional(),
        description: z
            .string()
            .max(255, { message: 'description must be at most 255 characters' })
            .optional()
            .or(z.literal('')),
    });
    return toValidationResult(schema.safeParse(params));
};

export const validateDeleteCategory = (params: any) => {
    const schema = z.object({
        categoryId: z
            .union([
                z
                    .string()
                    .regex(/^\d+$/, { message: 'categoryId must be a number' }),
                z.number().int(),
            ])
            .transform(v => (typeof v === 'string' ? Number(v) : v)),
    });
    return toValidationResult(schema.safeParse(params));
};
