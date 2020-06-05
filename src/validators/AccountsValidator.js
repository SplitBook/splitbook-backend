const { celebrate, Joi, Segments } = require('celebrate');

module.exports = {
  insert: celebrate({
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().trim().required(),
      user_id: Joi.string().allow(null).length(10),
      administrator: Joi.boolean().default(false),
      active: Joi.boolean().default(true),
    }),
  }),

  update: celebrate({
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().trim(),
      user_id: Joi.string().allow(null).length(10),
      administrator: Joi.boolean(),
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
