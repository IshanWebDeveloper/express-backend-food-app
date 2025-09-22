import { z } from 'zod';

type JoiLikeError = { details: Array<{ message: string }> };
type ValidationResult<T> = { value?: T; error?: JoiLikeError };

const toValidationResult = <T>(res: any): ValidationResult<T> => {
    if (res.success) return { value: res.data };
    const issue = res.error?.errors?.[0];
    const message = issue?.message || 'Validation error';
    return { error: { details: [{ message }] } };
};

export const validateUserIdParam = (params: any): ValidationResult<any> => {
    const schema = z.object({
        userId: z.uuid({ message: 'User ID must be a valid UUID' }),
    });
    return toValidationResult(schema.safeParse(params));
};
