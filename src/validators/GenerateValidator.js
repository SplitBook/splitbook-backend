const { celebrate, Joi, Segments } = require('celebrate');

module.exports = {
  generateReport: celebrate({
    [Segments.PARAMS]: Joi.object({
      report_id: Joi.string().length(36).required(),
    }),
  }),
};
