const { celebrate, Joi, Segments } = require('celebrate');

module.exports = {
  recoverPassword: celebrate({
    [Segments.BODY]: Joi.object({
      email: Joi.string().email().trim().required(),
    }),
    [Segments.QUERY]: Joi.object({
      change_password: Joi.boolean().default(false),
    }),
  }),
  changePassword: celebrate({
    [Segments.BODY]: Joi.object({
      password: Joi.string().required(),
    }),
    [Segments.QUERY]: Joi.object({
      token: Joi.string().required(),
    }),
  }),
};
