const { celebrate, Joi, Segments } = require('celebrate');

module.exports = {
  insert: celebrate({
    [Segments.BODY]: Joi.object().keys({
      isbn: Joi.string().trim().required().max(15),
      name: Joi.string().trim().required(),
      publishing_company: Joi.string().trim(),
      cover: Joi.string(),
      code: Joi.string().trim().uppercase().min(2).max(5).required(),
      active: Joi.boolean().default(true),
      subject_id: Joi.number().integer().min(1),
    }),
  }),

  update: celebrate({
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().trim().required(),
      publishing_company: Joi.string().trim(),
      cover: Joi.string(),
      active: Joi.boolean().default(true),
      subject_id: Joi.number().integer().min(1),
    }),
    [Segments.QUERY]: Joi.object({
      delete_cover: Joi.boolean().default(false),
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
