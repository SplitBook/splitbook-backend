const { celebrate, Joi, Segments } = require('celebrate');

module.exports = {
  index: celebrate({
    [Segments.QUERY]: Joi.object().keys({
      search: Joi.string().trim().allow('').default(''),
      orderBy: Joi.string().trim(),
      desc: Joi.boolean().default(false),
      limit: Joi.number().integer().min(5).max(100).default(5),
      page: Joi.number().integer().min(1).default(1),
      email_confirmed: Joi.boolean(),
    }),
  }),

  get: celebrate({
    [Segments.PARAMS]: Joi.object({
      id: Joi.string().length(36).required(),
    }),
  }),

  insert: celebrate({
    [Segments.BODY]: Joi.object().keys({
      username: Joi.string().trim().required(),
      email: Joi.string().email().trim().required(),
      active: Joi.boolean().default(true),
      phone: Joi.string().trim().allow(null).pattern(new RegExp(/[0-9]/)),
      born_date: Joi.date().allow(null).less('now'),
    }),
  }),

  update: celebrate({
    [Segments.BODY]: Joi.object().keys({
      username: Joi.string().trim(),
      email: Joi.string().email().trim(),
      active: Joi.boolean().default(true),
      phone: Joi.string().allow(null).trim().pattern(new RegExp(/[0-9]/)),
      born_date: Joi.date().allow(null).less('now'),
    }),
    [Segments.PARAMS]: Joi.object({
      id: Joi.string().length(36).required(),
    }),
    [Segments.QUERY]: Joi.object({
      delete_photo: Joi.boolean().default(false),
    }),
  }),

  delete: celebrate({
    [Segments.PARAMS]: Joi.object({
      id: Joi.string().length(36).required(),
    }),
  }),
};
