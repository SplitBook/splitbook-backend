const { celebrate, Joi, Segments } = require('celebrate');

module.exports = {
  index: celebrate({
    [Segments.QUERY]: Joi.object().keys({
      search: Joi.string().trim().allow('').default(''),
      orderBy: Joi.string().trim(),
      desc: Joi.boolean().default(false),
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
      user_id: Joi.string().allow(null).length(36),
      administrator: Joi.boolean().default(false),
      active: Joi.boolean().default(true),
    }),
  }),

  update: celebrate({
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().trim(),
      user_id: Joi.string().allow(null).length(36),
      administrator: Joi.boolean(),
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
