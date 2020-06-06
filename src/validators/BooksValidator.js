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
      isbn: Joi.string().trim().required(),
    }),
  }),

  insert: celebrate({
    [Segments.BODY]: Joi.object().keys({
      isbn: Joi.string().trim().required(),
      name: Joi.string().trim().required(),
      publishing_company: Joi.string().trim(),
      cover: Joi.string(),
      code: Joi.string().trim().uppercase().min(2).max(5).required(),
      active: Joi.boolean().default(true),
      subject_id: Joi.number().integer().min(1),
    }),
  }),

  update: celebrate({
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().trim(),
      publishing_company: Joi.string().trim().allow(null),
      cover: Joi.string(),
      active: Joi.boolean().default(true),
      subject_id: Joi.number().integer().min(1),
    }),
    [Segments.QUERY]: Joi.object({
      delete_cover: Joi.boolean().default(false),
    }),
    [Segments.PARAMS]: Joi.object({
      isbn: Joi.string().required(),
    }),
  }),

  delete: celebrate({
    [Segments.PARAMS]: Joi.object({
      isbn: Joi.string().required(),
    }),
  }),
};
