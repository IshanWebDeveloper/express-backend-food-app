import Joi from 'joi';

const options = {
    errors: {
        wrap: {
            label: '',
        },
    },
};

export const validateGetCart = (params: any) => {
    const schema = Joi.object({
        userId: Joi.number().integer().required().messages({
            'any.required': 'userId is required',
            'number.base': 'userId must be a number',
        }),
    });
    return schema.validate(params, options);
};

export const validateAddItem = (params: any) => {
    const schema = Joi.object({
        userId: Joi.number().integer().required().messages({
            'any.required': 'userId is required',
            'number.base': 'userId must be a number',
        }),
        productId: Joi.number().integer().required().messages({
            'any.required': 'productId is required',
            'number.base': 'productId must be a number',
        }),
        quantity: Joi.number().integer().min(1).required().messages({
            'any.required': 'quantity is required',
            'number.base': 'quantity must be a number',
            'number.min': 'quantity must be at least 1',
        }),
    });
    return schema.validate(params, options);
};

export const validateRemoveItem = (params: any) => {
    const schema = Joi.object({
        userId: Joi.number().integer().required().messages({
            'any.required': 'userId is required',
            'number.base': 'userId must be a number',
        }),
        productId: Joi.number().integer().required().messages({
            'any.required': 'productId is required',
            'number.base': 'productId must be a number',
        }),
    });
    return schema.validate(params, options);
};

export const validateClearCart = (params: any) => {
    const schema = Joi.object({
        userId: Joi.number().integer().required().messages({
            'any.required': 'userId is required',
            'number.base': 'userId must be a number',
        }),
    });
    return schema.validate(params, options);
};
