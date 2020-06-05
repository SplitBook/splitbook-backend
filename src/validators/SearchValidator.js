const { celebrate, Joi, Segments } = require('celebrate');

module.exports = {
  searchUsers: celebrate({
    [Segments.QUERY]: Joi.object().keys({
      search: Joi.string().trim().required(),
      limit: Joi.number().integer().min(5).max(100).default(5),
      page: Joi.number().integer().min(1).default(1),
    }),
  }),
  searchPhysicalBooks: celebrate({
    [Segments.QUERY]: Joi.object().keys({
      search: Joi.string().trim().required(),
      limit: Joi.number().integer().min(5).max(100).default(5),
      page: Joi.number().integer().min(1).default(1),
    }),
  }),
  searchBooks: celebrate({
    [Segments.QUERY]: Joi.object().keys({
      search: Joi.string().trim().required(),
      limit: Joi.number().integer().min(5).max(100).default(5),
      page: Joi.number().integer().min(1).default(1),
    }),
  }),
};
