const { celebrate, Joi, Segments } = require('celebrate');

module.exports = {
  insert: celebrate({
    [Segments.BODY]: Joi.object().keys({
      book_requisition_id: Joi.number().integer().min(1).required(),
      physical_book_id: Joi.string()
        .pattern(new RegExp(/[A-Z]{2,5}-.{6}/))
        .min(9)
        .max(12)
        .required(),
      delivery_date: Joi.date(),
      return_date: Joi.date(),
      active: Joi.boolean().default(true),
    }),
  }),

  update: celebrate({
    [Segments.BODY]: Joi.object().keys({
      book_requisition_id: Joi.number().integer().min(1).required(),
      physical_book_id: Joi.string()
        .pattern(new RegExp(/[A-Z]{2,5}-.{6}/))
        .min(9)
        .max(12)
        .required(),
      delivery_date: Joi.date(),
      return_date: Joi.date(),
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
