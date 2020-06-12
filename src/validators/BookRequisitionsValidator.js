const { celebrate, Joi, Segments } = require('celebrate');

module.exports = {
  insert: celebrate({
    [Segments.BODY]: Joi.object().keys({
      adopted_book_id: Joi.number().integer().min(1).required(),
      requisition_id: Joi.number().integer().min(1).required(),
      active: Joi.boolean().default(true),
    }),
  }),

  get: celebrate({
    [Segments.PARAMS]: Joi.object({
      id: Joi.number().integer().min(1).required(),
    }),
  }),

  update: celebrate({
    [Segments.BODY]: Joi.object().keys({
      adopted_book_id: Joi.number().integer().min(1).required(),
      requisition_id: Joi.number().integer().min(1).required(),
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
