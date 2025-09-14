import Joi from 'joi';

const options = {
    errors: {
        wrap: {
            label: '',
        },
    },
};

export const validateCreateFood = (foodData: any) => {
    const schema = Joi.object({
        name: Joi.string().min(1).required().messages({
            'string.min': 'Food name should be at least 1 character',
            'any.required': 'Food name is required',
        }),
        price: Joi.number().min(0).required().messages({
            'number.min': 'Price must be non-negative',
            'any.required': 'Price is required',
        }),
        categoryId: Joi.number().required().messages({
            'any.required': 'Category ID is required',
        }),
        description: Joi.string().optional(),
    });
    return schema.validate(foodData, options);
};

export const validateGetFood = (params: any) => {
    const schema = Joi.object({
        foodId: Joi.number().required().messages({
            'any.required': 'Food ID is required',
        }),
    });
    return schema.validate(params, options);
};

export const validateUpdateFood = (params: any) => {
    const schema = Joi.object({
        foodId: Joi.number().required().messages({
            'any.required': 'Food ID is required',
        }),
        name: Joi.string().min(1).optional(),
        price: Joi.number().min(0).optional(),
        categoryId: Joi.number().optional(),
        description: Joi.string().optional(),
    });
    return schema.validate(params, options);
};

export const validateDeleteFood = (params: any) => {
    const schema = Joi.object({
        foodId: Joi.number().required().messages({
            'any.required': 'Food ID is required',
        }),
    });
    return schema.validate(params, options);
};
