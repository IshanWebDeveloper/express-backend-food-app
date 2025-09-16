import Joi from 'joi';

const options = {
    errors: {
        wrap: {
            label: '',
        },
    },
};

export const validateAddFavoriteFood = (data: any) => {
    const schema = Joi.object({
        foodId: Joi.string().uuid().required().messages({
            'any.required': 'Food ID is required',
            'string.uuid': 'Food ID must be a valid UUID',
        }),
    });
    return schema.validate(data, options);
};

export const validateUserIdParam = (params: any) => {
    const schema = Joi.object({
        userId: Joi.string().uuid().required().messages({
            'any.required': 'User ID is required',
            'string.uuid': 'User ID must be a valid UUID',
        }),
    });
    return schema.validate(params, options);
};
