import Joi from 'joi';

const options = {
    errors: {
        wrap: {
            label: '',
        },
    },
};

export const validateGetCategory = (params: any) => {
    const schema = Joi.object({
        categoryId: Joi.number().integer().required().messages({
            'any.required': 'categoryId is required',
            'number.base': 'categoryId must be a number',
        }),
    });
    return schema.validate(params, options);
};

export const validateCreateCategory = (params: any) => {
    const schema = Joi.object({
        name: Joi.string().min(1).max(100).required().messages({
            'any.required': 'name is required',
            'string.base': 'name must be a string',
            'string.empty': 'name cannot be empty',
            'string.max': 'name must be at most 100 characters',
        }),
        description: Joi.string().allow('').max(255).messages({
            'string.base': 'description must be a string',
            'string.max': 'description must be at most 255 characters',
        }),
    });
    return schema.validate(params, options);
};

export const validateUpdateCategory = (params: any) => {
    const schema = Joi.object({
        categoryId: Joi.number().integer().required().messages({
            'any.required': 'categoryId is required',
            'number.base': 'categoryId must be a number',
        }),
        name: Joi.string().min(1).max(100).messages({
            'string.base': 'name must be a string',
            'string.empty': 'name cannot be empty',
            'string.max': 'name must be at most 100 characters',
        }),
        description: Joi.string().allow('').max(255).messages({
            'string.base': 'description must be a string',
            'string.max': 'description must be at most 255 characters',
        }),
    });
    return schema.validate(params, options);
};

export const validateDeleteCategory = (params: any) => {
    const schema = Joi.object({
        categoryId: Joi.number().integer().required().messages({
            'any.required': 'categoryId is required',
            'number.base': 'categoryId must be a number',
        }),
    });
    return schema.validate(params, options);
};
