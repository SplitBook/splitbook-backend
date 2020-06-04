const { celebrate, Joi, Segments } = require('celebrate');

module.exports = {
  insert: celebrate({
    [Segments.BODY]: Joi.object().keys({
      book_isbn: Joi.string().trim().required().max(15),
      available: Joi.boolean().default(true),
      description: Joi.string().trim(),
      active: Joi.boolean().default(true),
      state_id: Joi.number().integer().min(1).required(),
      location_id: Joi.number().integer().min(1),
    }),
  }),

  update: celebrate({
    [Segments.BODY]: Joi.object().keys({
      available: Joi.boolean().default(true),
      description: Joi.string().trim(),
      active: Joi.boolean().default(true),
      state_id: Joi.number().integer().min(1).required(),
      location_id: Joi.number().integer().min(1),
    }),
    [Segments.PARAMS]: Joi.object({
      id: Joi.string()
        .pattern(new RegExp(/[A-Z]{2,5}-.{6}/))
        .min(9)
        .max(12)
        .required(),
    }),
  }),

  delete: celebrate({
    [Segments.PARAMS]: Joi.object({
      id: Joi.string()
        .pattern(new RegExp(/[A-Z]{2,5}-.{6}/))
        .min(9)
        .max(12)
        .required(),
    }),
  }),
};