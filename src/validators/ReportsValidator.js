const { celebrate, Joi, Segments } = require('celebrate');

module.exports = {
  index: celebrate({
    [Segments.QUERY]: Joi.object().keys({
      search: Joi.string().trim().allow('').default(''),
      orderBy: Joi.string().trim(),
      desc: Joi.boolean().default(false),
      limit: Joi.number().integer().min(5).max(100).default(5),
      page: Joi.number().integer().min(1).default(1),
      is_file_signed: Joi.boolean(),
    }),
  }),

  get: celebrate({
    [Segments.PARAMS]: Joi.object({
      id: Joi.string().length(36).required(),
    }),
  }),

  update: celebrate({
    [Segments.BODY]: Joi.object().keys({
      valid: Joi.boolean(),
      description: Joi.string().trim().allow(null),
      report_date: Joi.date(),
    }),
    [Segments.PARAMS]: Joi.object({
      id: Joi.string().length(36).required(),
    }),
    [Segments.QUERY]: Joi.object({
      delete_file_signed: Joi.boolean().default(false),
    }),
  }),

  delete: celebrate({
    [Segments.PARAMS]: Joi.object({
      id: Joi.string().length(36).required(),
    }),
  }),
};
