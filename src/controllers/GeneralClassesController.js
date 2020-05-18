const knex = require('../database');
const { softDelete, softUpdate } = require('../utils/DatabaseOperations');

module.exports = {
  async index(req, res, next) {
    const classes = await knex('general_classes')
      .select('*')
      .whereNull('deleted_at')
      .orderBy('id');

    return res.json(classes);
  },

  async store(req, res, next) {
    const generalClass = req.body.class;

    try {
      await knex('general_classes').insert({ class: generalClass });
      return res.status(201).send();
    } catch (err) {
      return res.status(406).json(err);
    }
  },

  async update(req, res) {
    const { id } = req.params;
    const { active } = req.body;
    const generalClass = req.body['class'];

    return res
      .status(
        await softUpdate('general_classes', id, { class: generalClass, active })
      )
      .send();
  },

  async delete(req, res) {
    const { id } = req.params;

    return res.status(await softDelete('general_classes', id)).send();
  },
};
