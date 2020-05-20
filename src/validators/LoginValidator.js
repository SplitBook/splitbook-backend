const { celebrate, Joi, Segments } = require('celebrate');

module.exports = {
  login: celebrate({
    [Segments.BODY]: Joi.object().keys({
      email: Joi.string().email().trim().required(),
      password: Joi.string().required(),
    }),
  }),

  register: celebrate({
    [Segments.BODY]: Joi.object({
      password: Joi.string().required(),
    }),
    [Segments.QUERY]: Joi.object({
      token: Joi.string().required(),
    }),
  }),

  recoverPassword: celebrate({
    [Segments.BODY]: Joi.object({
      email: Joi.string().email().trim().required(),
    }),
    [Segments.QUERY]: Joi.object({
      change_password: Joi.boolean().default(false),
    }),
  }),
};
