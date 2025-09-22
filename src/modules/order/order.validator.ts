import { z } from 'zod';

type JoiLikeError = { details: Array<{ message: string }> };
type ValidationResult<T> = { value?: T; error?: JoiLikeError };

const toValidationResult = <T>(res: any): ValidationResult<T> => {
    if (res.success) return { value: res.data };
    const issue = res.error?.errors?.[0];
    const message = issue?.message || 'Validation error';
    return { error: { details: [{ message }] } };
};

export const validateCreateOrder = (orderData: any): ValidationResult<any> => {
    const itemSchema = z.object({
        productId: z
            .string()
            .uuid({ message: 'Product ID must be a valid UUID' }),
        quantity: z
            .number()
            .int()
            .min(1, { message: 'Quantity must be at least 1' }),
    });
    const schema = z.object({
        items: z
            .array(itemSchema)
            .min(1, { message: 'Order must have at least one item' }),
    });
    return toValidationResult(schema.safeParse(orderData));
};
