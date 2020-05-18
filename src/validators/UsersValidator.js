const { celebrate, Joi, Segments } = require('celebrate');

module.exports = {
  insert: celebrate({
    [Segments.BODY]: Joi.object().keys({
      username: Joi.string(),
      email: Joi.string().required(),
      active: Joi.boolean().default(true),
      charge_id: Joi.number().integer().min(1),
    }),
  }),

  update: celebrate({
    [Segments.BODY]: Joi.object().keys({
      username: Joi.string(),
      active: Joi.boolean().default(true),
      charge_id: Joi.number().integer().min(1),
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
