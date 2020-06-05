const { celebrate, Joi, Segments } = require('celebrate');

module.exports = {
  insert: celebrate({
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().trim().required(),
      number: Joi.string()
        .trim()
        .pattern(new RegExp(/([0-9]{1,4})\b\/([0-9]{2})\b/))
        .max(7)
        .required(),
      born_date: Joi.date().less('now'),
      active: Joi.boolean().default(true),
    }),
  }),

  update: celebrate({
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().trim(),
      born_date: Joi.date().less('now'),
      active: Joi.boolean().default(true),
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
