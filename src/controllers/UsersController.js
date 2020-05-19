const knex = require('../database');
const { softDelete, softUpdate } = require('../utils/DatabaseOperations');
const { encript } = require('../utils/PasswordUtils');
const { generateId } = require('../utils/UserUtils');

module.exports = {
  async index(req, res, next) {
    const users = await knex('users')
      .select([
        'users.id',
        'username',
        'email',
        'charge_id',
        'charge',
        'email_confirmed',
        'users.created_at',
        'users.updated_at',
        'users.deleted_at',
        'users.active',
      ])
      .innerJoin('charges', 'charges.id', '=', 'users.charge_id')
      .whereNull('users.deleted_at')
      .orderBy('users.id');

    return res.json(users);
  },

  async store(req, res, next) {
    const { username, email, charge_id } = req.body;

    try {
      const id = generateId();
      const password = await encript('null');

      await knex('users').insert({ id, username, email, charge_id, password });
      return res.status(201).send();
    } catch (err) {
      return res.status(406).json(err);
    }
  },

  async update(req, res) {
    const { id } = req.params;
    const { username, charge_id, active } = req.body;

    const password = await encript('null');

    return res
      .status(
        await softUpdate('users', id, {
          username,
          password,
          charge_id,
          active,
          email_confirmed: false,
        })
      )
      .send();
  },

  async delete(req, res) {
    const { id } = req.params;

    return res.status(await softDelete('users', id)).send();
  },
};
