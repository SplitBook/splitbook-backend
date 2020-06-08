const { celebrate, Joi, Segments } = require('celebrate');

module.exports = {
  index: celebrate({
    [Segments.QUERY]: Joi.object().keys({
      search: Joi.string().trim().allow('').default(''),
      orderBy: Joi.string().trim(),
      desc: Joi.boolean().default(false),
      limit: Joi.number().integer().min(5).max(100).default(5),
      page: Joi.number().integer().min(1).default(1),
      school_subject_id: Joi.string().trim(),
      school_year_id: Joi.string().trim(),
      class_id: Joi.string().trim(),
      current_school_year: Joi.boolean().default(false),
    }),
  }),

  get: celebrate({
    [Segments.PARAMS]: Joi.object({
      id: Joi.number().integer().min(1).required(),
    }),
  }),

  insert: celebrate({
    [Segments.BODY]: Joi.object().keys({
      class_id: Joi.number().integer().min(1).required(),
      school_year_id: Joi.number().integer().min(1),
      school_subject_id: Joi.number().integer().min(1).required(),
      active: Joi.boolean().default(true),
    }),
  }),

  update: celebrate({
    [Segments.BODY]: Joi.object().keys({
      active: Joi.boolean().default(true),
      class_id: Joi.number().integer().min(1),
      school_year_id: Joi.number().integer().min(1),
      school_subject_id: Joi.number().integer().min(1),
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
