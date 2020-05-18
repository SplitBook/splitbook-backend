const { celebrate, Joi, Segments } = require('celebrate');

module.exports = {
  insert: celebrate({
    [Segments.BODY]: Joi.object().keys({
      isbn: Joi.string().required().max(15),
      name: Joi.string().required(),
      publishing_company: Joi.string(),
      cover: Joi.string(),
      active: Joi.boolean().default(true),
      subject_id: Joi.number().integer().min(1),
    }),
  }),

  update: celebrate({
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().required(),
      publishing_company: Joi.string(),
      cover: Joi.string(),
      active: Joi.boolean().default(true),
      subject_id: Joi.number().integer().min(1),
    }),
    [Segments.PARAMS]: Joi.object({
      isbn: Joi.string().required(),
    }),
  }),

  delete: celebrate({
    [Segments.PARAMS]: Joi.object({
      isbn: Joi.string().required(),
    }),
  }),
};
