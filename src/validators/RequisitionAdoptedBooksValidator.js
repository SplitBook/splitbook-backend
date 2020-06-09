const { celebrate, Joi, Segments } = require('celebrate');

module.exports = {
  insert: celebrate({
    [Segments.BODY]: Joi.object().keys({
      school_enrollment_id: Joi.number().integer().min(1).required(),
      state_id: Joi.number().integer().min(1),
      adopted_books_ids: Joi.array()
        .items(Joi.number().integer().min(1))
        .required(),
    }),
  }),
};
