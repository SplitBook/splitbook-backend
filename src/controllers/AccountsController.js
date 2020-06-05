const knex = require('../database');
const { softDelete, softUpdate } = require('../utils/DatabaseOperations');
const EnumCharges = require('../utils/enums/EnumCharges');

module.exports = {
  async index(req, res, next) {
    const accounts = await knex('accounts')
      .select('*')
      .whereNull('deleted_at')
      .orderBy('created_at');

    return res.json(accounts);
  },

  async store(req, res) {
    const { name, user_id, administrator } = req.body;
    const charge = administrator ? EnumCharges.ADMIN : EnumCharges.SECRETARY;

    try {
      const [account] = await knex('accounts')
        .insert({
          name,
          user_id,
          charge,
        })
        .returning('*');

      return res.json(account);
    } catch (err) {
      return res.status(406).json(err);
    }
  },

  async update(req, res) {
    const { id } = req.params;
    const { name, user_id, administrator, active } = req.body;
    const charge = administrator ? EnumCharges.ADMIN : EnumCharges.SECRETARY;

    try {
      const { statusCode, data } = await softUpdate('accounts', id, {
        name,
        user_id,
        charge,
        active,
      });

      return res.status(statusCode).json(data);
    } catch (err) {
      return res.status(406).json(err);
    }
  },

  async delete(req, res) {
    const { id } = req.params;

    return res.status(await softDelete('accounts', id)).send();
  },
};
