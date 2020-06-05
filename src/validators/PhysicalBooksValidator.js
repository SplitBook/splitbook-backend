const { celebrate, Joi, Segments } = require('celebrate');

module.exports = {
  index: celebrate({
    [Segments.QUERY]: Joi.object().keys({
      search: Joi.string().trim().default(''),
      limit: Joi.number().integer().min(5).max(100).default(5),
      page: Joi.number().integer().min(1).default(1),
    }),
  }),

  insert: celebrate({
    [Segments.BODY]: Joi.object().keys({
      book_isbn: Joi.string().trim().required(),
      available: Joi.boolean().default(true),
      description: Joi.string().trim(),
      active: Joi.boolean().default(true),
      state_id: Joi.number().integer().min(1).required(),
      location_id: Joi.number().integer().min(1),
    }),
  }),

  update: celebrate({
    [Segments.BODY]: Joi.object().keys({
      available: Joi.boolean().default(true),
      description: Joi.string().trim().allow(null, ''),
      active: Joi.boolean().default(true),
      state_id: Joi.number().integer().min(1),
      location_id: Joi.number().integer().min(1).allow(null),
    }),
    [Segments.PARAMS]: Joi.object({
      id: Joi.string()
        .pattern(new RegExp(/[A-Z]{2,5}-.{6}/))
        .min(9)
        .max(12)
        .required(),
    }),
  }),

  delete: celebrate({
    [Segments.PARAMS]: Joi.object({
      id: Joi.string()
        .pattern(new RegExp(/[A-Z]{2,5}-.{6}/))
        .min(9)
        .max(12)
        .required(),
    }),
  }),
};
