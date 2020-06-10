const { celebrate, Joi, Segments } = require('celebrate');

module.exports = {
  index: celebrate({
    [Segments.QUERY]: Joi.object().keys({
      search: Joi.string().trim().allow('').default(''),
      orderBy: Joi.string().trim(),
      desc: Joi.boolean().default(false),
      limit: Joi.number().integer().min(5).max(100).default(5),
      page: Joi.number().integer().min(1).default(1),
      book_isbn: Joi.string().trim(),
      state_id: Joi.string().trim(),
      subject_id: Joi.string().trim(),
      location_id: Joi.string().trim(),
      requisition_id: Joi.string().trim(),
      adopted_book_id: Joi.string().trim(),
      available: Joi.boolean(),
    }),
  }),

  get: celebrate({
    [Segments.PARAMS]: Joi.object({
      isbn: Joi.string().trim().required(),
    }),
  }),

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
