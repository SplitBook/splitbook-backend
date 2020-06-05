const { celebrate, Joi, Segments } = require('celebrate');

module.exports = {
  index: celebrate({
    [Segments.QUERY]: Joi.object().keys({
      search: Joi.string().trim().default(''),
      limit: Joi.number().integer().min(5).max(100).default(5),
      page: Joi.number().integer().min(1).default(1),
    }),
  }),

  get: celebrate({
    [Segments.PARAMS]: Joi.object({
      id: Joi.number().integer().min(1).required(),
    }),
  }),

  insert: celebrate({
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().trim().required(),
      user_id: Joi.string().allow(null).length(10),
      active: Joi.boolean().default(true),
    }),
  }),

  update: celebrate({
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().trim(),
      user_id: Joi.string().allow(null).length(10),
      active: Joi.boolean().default(true),
    }),
    [Segments.PARAMS]: Joi.object({
      id: Joi.number().integer().min(1).required(),
    }),
  }),

  delete: celebrate({
    [Segments.PARAMS]: Joi.object({
      id: Joi.number().integer().min(1).required(),
    }),
  }),
};
