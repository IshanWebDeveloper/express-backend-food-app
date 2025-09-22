import { z } from 'zod';

// Helpers
const uuidMsg = (label: string) => `${label} must be a valid UUID`;

type JoiLikeError = { details: Array<{ message: string }> };
type ValidationResult<T> = { value?: T; error?: JoiLikeError };

const toValidationResult = <T>(res: any): ValidationResult<T> => {
    if (res.success) return { value: res.data };
    const issue = res.error?.errors?.[0];
    const message = issue?.message || 'Validation error';
    return { error: { details: [{ message }] } };
};

// Schemas (keeping messages close to the former Joi ones)
const createDishSchema = z.object({
    name: z
        .string()
        .min(1, { message: 'Dish name should be at least 1 character' }),
    price: z.coerce.number().min(0, { message: 'Price must be non-negative' }),
    category_id: z.uuid({ message: uuidMsg('Category ID') }),
    description: z.string().optional(),
});

// Accept multiple possible param names (route uses dishid/categoryid)
const idUnionSchema = z
    .object({ dishid: z.uuid({ message: uuidMsg('Dish ID') }) })
    .or(z.object({ dishId: z.uuid({ message: uuidMsg('Dish ID') }) }))
    .or(
        z.object({
            categoryId: z.uuid({ message: uuidMsg('Category ID') }),
        }),
    )
    .or(
        z.object({
            categoryid: z.uuid({ message: uuidMsg('Category ID') }),
        }),
    );

const updateDishSchema = idUnionSchema.and(
    z.object({
        name: z.string().min(1).optional(),
        price: z.coerce.number().min(0).optional(),
        category_id: z.uuid({ message: uuidMsg('Category ID') }).optional(),
        description: z.string().optional(),
    }),
);

const deleteDishSchema = idUnionSchema;

// Exports (keep same function names/signatures as before)
export const validateCreateFood = (foodData: any) => {
    const res = createDishSchema.safeParse(foodData);
    return toValidationResult(res);
};

export const validateGetFood = (params: any) => {
    const res = idUnionSchema.safeParse(params);
    if (!res.success) {
        return {
            error: {
                details: [
                    {
                        message:
                            'Food ID is required and must be a valid UUID (accepts foodId/dishid/dishId/categoryId/categoryid)',
                    },
                ],
            },
        };
    }
    return { value: res.data };
};

export const validateUpdateFood = (params: any) => {
    const res = updateDishSchema.safeParse(params);
    return toValidationResult(res);
};

export const validateDeleteFood = (params: any) => {
    const res = deleteDishSchema.safeParse(params);
    if (!res.success) {
        return {
            error: {
                details: [
                    {
                        message:
                            'Food ID is required and must be a valid UUID (accepts foodId/dishid/dishId/categoryId/categoryid)',
                    },
                ],
            },
        };
    }
    return { value: res.data };
};
