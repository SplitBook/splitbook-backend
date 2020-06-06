const { celebrate, Joi, Segments } = require('celebrate');

module.exports = {
  insert: celebrate({
    [Segments.BODY]: Joi.object().keys({
      username: Joi.string().trim(),
      email: Joi.string().email().trim().required(),
      active: Joi.boolean().default(true),
      phone: Joi.string().trim().pattern(new RegExp(/[0-9]/)),
      born_date: Joi.date().less('now'),
    }),
  }),

  get: celebrate({
    [Segments.PARAMS]: Joi.object({
      id: Joi.string().length(10).required(),
    }),
  }),

  update: celebrate({
    [Segments.BODY]: Joi.object().keys({
      username: Joi.string().trim(),
      email: Joi.string().email().trim().required(),
      active: Joi.boolean().default(true),
      phone: Joi.string().trim().pattern(new RegExp(/[0-9]/)),
      born_date: Joi.date().less('now'),
    }),
    [Segments.PARAMS]: Joi.object({
      id: Joi.string().length(10).required(),
    }),
    [Segments.QUERY]: Joi.object({
      delete_photo: Joi.boolean().default(false),
    }),
  }),

  delete: celebrate({
    [Segments.PARAMS]: Joi.object({
      id: Joi.string().length(10).required(),
    }),
  }),
};
