const { celebrate, Joi, Segments } = require('celebrate');

module.exports = {
  update: celebrate({
    [Segments.BODY]: Joi.object().keys({
      key: Joi.string().trim().required(),
      value: Joi.string().trim().required(),
      active: Joi.boolean().default(true),
    }),
  }),
};
