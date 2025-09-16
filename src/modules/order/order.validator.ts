import Joi from 'joi';

const options = {
    errors: {
        wrap: {
            label: '',
        },
    },
};

export const validateCreateOrder = (orderData: any) => {
    const schema = Joi.object({
        items: Joi.array()
            .items(
                Joi.object({
                    productId: Joi.string().uuid().required().messages({
                        'any.required': 'Product ID is required',
                        'string.uuid': 'Product ID must be a valid UUID',
                    }),
                    quantity: Joi.number()
                        .integer()
                        .min(1)
                        .required()
                        .messages({
                            'number.base': 'Quantity must be a number',
                            'number.min': 'Quantity must be at least 1',
                            'any.required': 'Quantity is required',
                        }),
                }),
            )
            .min(1)
            .required()
            .messages({
                'array.min': 'Order must have at least one item',
                'any.required': 'Order items are required',
            }),
    });
    return schema.validate(orderData, options);
};
