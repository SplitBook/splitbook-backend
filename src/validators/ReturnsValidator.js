const { celebrate, Joi, Segments } = require('celebrate');

module.exports = {
  update: celebrate({
    [Segments.BODY]: Joi.object().keys({
      book_state_id: Joi.number().integer().min(1).required(),
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
