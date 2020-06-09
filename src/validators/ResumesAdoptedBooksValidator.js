const { celebrate, Joi, Segments } = require('celebrate');

module.exports = {
  index: celebrate({
    [Segments.QUERY]: Joi.object().keys({
      school_year_id: Joi.number().integer().min(1),
      class_id: Joi.number().integer().min(1),
      school_enrollment_id: Joi.number().integer().min(1),
    }),
  }),

  get: celebrate({
    [Segments.PARAMS]: Joi.object({
      resume_id: Joi.number().integer().min(1).required(),
    }),
  }),
};
