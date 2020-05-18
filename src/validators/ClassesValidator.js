const { celebrate, Joi, Segments } = require('celebrate');

module.exports = {
  insert: celebrate({
    [Segments.BODY]: Joi.object().keys({
      class_id: Joi.number().integer().min(1).required(),
      school_year_id: Joi.number().integer().min(1).required(),
      head_class_id: Joi.number().integer().min(1),
      active: Joi.boolean().default(true),
    }),
  }),

  update: celebrate({
    [Segments.BODY]: Joi.object().keys({
      class_id: Joi.number().integer().min(1).required(),
      school_year_id: Joi.number().integer().min(1).required(),
      head_class_id: Joi.number().integer().min(1),
      active: Joi.boolean().default(true),
    }),
    [Segments.PARAMS]: Joi.object({
      id: Joi.number().integer().min(1).required(),
    }),
  }),

  delete: celebrate({
    [Segments.BODY]: Joi.object().keys({
      class_id: Joi.number().integer().min(1).required(),
      school_year_id: Joi.number().integer().min(1).required(),
    }),
  }),
};
