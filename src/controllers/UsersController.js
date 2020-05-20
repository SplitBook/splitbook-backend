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
        'photo',
        'phone',
        'born_date',
        'email_confirmed',
        'users.created_at',
        'users.updated_at',
        'users.deleted_at',
        'users.active',
      ])
      .whereNull('users.deleted_at')
      .orderBy('users.id');

    return res.json(users);
  },

  async store(req, res, next) {
    const { username, email, born_date, phone } = req.body;
    const photo = req.file ? req.file.filename : undefined;

    try {
      const id = generateId();
      const password = await encript('null');

      await knex('users').insert({
        id,
        username,
        email,
        password,
        born_date,
        phone,
        photo,
      });

      //TODO : Send email to set password
      return res.status(201).send();
    } catch (err) {
      return res.status(406).json(err);
    }
  },

  async update(req, res) {
    const { id } = req.params;
    const { delete_photo } = req.query;
    const { username, email, phone, born_date, active } = req.body;
    let photo = req.file ? req.file.filename : undefined;

    const password = await encript('null');

    if (delete_photo && photo === undefined) photo = null;

    try {
      return res
        .status(
          await softUpdate('users', id, {
            username,
            password,
            active,
            email,
            born_date,
            phone,
            photo,
            email_confirmed: false,
          })
        )
        .send();
    } catch (err) {
      return res.status(406).json(err);
    }

    // TODO : After update send email to recover password
  },

  async delete(req, res) {
    const { id } = req.params;

    return res.status(await softDelete('users', id)).send();
  },
};
