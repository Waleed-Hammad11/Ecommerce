import ApiError from '../utils/ApiError.js';

const validate = (schema, target = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[target], {
      abortEarly: false,
      stripUnknown: true,
      convert: true,
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message.replace(/['"]/g, ''),
      }));

      return next(ApiError.badRequest('Validation failed', errors));
    }

    // Express 5: req.query/params are read-only, attach validated values to req.validatedQuery/req.validatedParams
    if (target === 'body') {
      req.body = value;
    } else if (target === 'query') {
      req.validatedQuery = value;
    } else if (target === 'params') {
      req.validatedParams = value;
    }

    next();
  };
};

export default validate;
