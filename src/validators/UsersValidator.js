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
      id: Joi.string().length(10).required(),
    }),
  }),

  insert: celebrate({
    [Segments.BODY]: Joi.object().keys({
      username: Joi.string().trim(),
      email: Joi.string().email().trim().required(),
      active: Joi.boolean().default(true),
      phone: Joi.string().trim(),
      born_date: Joi.date().less('now'),
    }),
  }),

  update: celebrate({
    [Segments.BODY]: Joi.object().keys({
      username: Joi.string().allow(null).trim(),
      email: Joi.string().email().trim(),
      active: Joi.boolean().default(true),
      phone: Joi.string().allow(null).trim(),
      born_date: Joi.date().less('now'),
    }),
    [Segments.PARAMS]: Joi.object({
      id: Joi.string().length(10).required(),
    }),
    [Segments.QUERY]: Joi.object({
      delete_photo: Joi.boolean().default(false),
    }),
  }),

  delete: celebrate({
    [Segments.PARAMS]: Joi.object({
      id: Joi.string().length(10).required(),
    }),
  }),
};
