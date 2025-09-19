import Joi from 'joi';

const options = {
    errors: { wrap: { label: '' } },
    abortEarly: true,
};

export const validateSalesQuery = (query: any) => {
    const schema = Joi.object({
        period: Joi.string().valid('day', 'week', 'month').default('day'),
        startDate: Joi.string().isoDate().optional(),
        endDate: Joi.string().isoDate().optional(),
        status: Joi.alternatives()
            .try(Joi.string(), Joi.array().items(Joi.string()))
            .optional(),
    });
    return schema.validate(query, options);
};

export const validateTopItemsQuery = (query: any) => {
    const schema = Joi.object({
        metric: Joi.string().valid('quantity', 'revenue').default('quantity'),
        startDate: Joi.string().isoDate().optional(),
        endDate: Joi.string().isoDate().optional(),
        limit: Joi.number().integer().min(1).max(100).default(10),
        status: Joi.alternatives()
            .try(Joi.string(), Joi.array().items(Joi.string()))
            .optional(),
    });
    return schema.validate(query, options);
};

export const validateAOVQuery = (query: any) => {
    const schema = Joi.object({
        period: Joi.string().valid('day', 'week', 'month').default('day'),
        startDate: Joi.string().isoDate().optional(),
        endDate: Joi.string().isoDate().optional(),
        status: Joi.alternatives()
            .try(Joi.string(), Joi.array().items(Joi.string()))
            .optional(),
    });
    return schema.validate(query, options);
};
