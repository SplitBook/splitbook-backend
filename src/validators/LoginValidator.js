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

  profile: celebrate({
    [Segments.BODY]: Joi.object({
      token: Joi.string().required(),
      profile_id: Joi.number().integer().min(1).required(),
      charge: Joi.string().trim().required(),
    }),
  }),
};
