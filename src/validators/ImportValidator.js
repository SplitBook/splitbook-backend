const { celebrate, Joi, Segments } = require('celebrate');

module.exports = {
  importSchoolEnrollmentByClass: celebrate({
    [Segments.QUERY]: Joi.object().keys({
      class_id: Joi.number().integer().min(1).required(),
      school_year_id: Joi.number().integer().min(1),
    }),
  }),
};
