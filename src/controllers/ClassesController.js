const knex = require('../database');

module.exports = {
  async index(req, res, next) {
    const classes = await knex('classes')
      .select('*')
      .whereNull('deleted_at')
      .orderBy('class_id');

    return res.json(classes);
  },

  async store(req, res, next) {
    const { class_id, school_year_id, head_class_id } = req.body;

    try {
      await knex('classes').insert({ class_id, school_year_id, head_class_id });
      return res.status(201).send();
    } catch (err) {
      return res.status(406).json(err);
    }
  },

  async update(req, res) {
    const { class_id, school_year_id, head_class_id } = req.body;

    try {
      const result = await knex('classes')
        .update({ head_class_id, updated_at: new Date() })
        .where({ class_id, school_year_id })
        .whereNull('deleted_at');

      if (result > 0) {
        result = 202;
      } else {
        result = 404;
      }
      return res.status(result).send();
    } catch (err) {
      return res.status(406).json(err);
    }
  },

  async delete(req, res) {
    const { class_id, school_year_id } = req.body;

    try {
      const result = await knex('classes')
        .update({ deleted_at: new Date() })
        .where({ class_id, school_year_id })
        .whereNull('deleted_at');

      if (result > 0) {
        result = 204;
      } else {
        result = 404;
      }
      return res.status(result).send();
    } catch (err) {
      return res.status(500).json(err);
    }
  },
};
