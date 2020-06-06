const knex = require('../database');
const Queue = require('../stack');
const { softDelete, softUpdate } = require('../utils/DatabaseOperations');
const { createPagination } = require('../utils/PaginatorUtils');
const { encript } = require('../utils/PasswordUtils');
const { generateId } = require('../utils/UserUtils');
const { generate, EnumTokenTypes } = require('../utils/TokenUtils');
const { EnumEmailTypes } = require('../email');

module.exports = {
  /*
   * Search By:
   * Email
   * Username
   * Phone
   * Born Date
   */
  async index(req, res, next) {
    const { search, page, limit, orderBy, desc } = req.query;

    try {
      let pagination = await createPagination(
        'users',
        { search, page, limit },
        {
          orderBy: orderBy || 'users.updated_at',
          desc,
          searchColumns: ['email', 'username', 'phone', 'born_date'],
        }
      );

      pagination.data = pagination.data.map((user) => {
        user.password = undefined;
        return user;
      });

      return res.json(pagination);
    } catch (err) {
      return res.status(406).json(err);
    }
  },

  async get(req, res) {
    const { id } = req.params;

    const user = await knex('users')
      .select('*')
      .where('id', id)
      .whereNull('deleted_at')
      .first();

    if (user) {
      user.password = undefined;

      user.profiles = await knex('accounts')
        .where('user_id', user.id)
        .whereNull('deleted_at')
        .union([
          knex('guardians')
            .where('user_id', user.id)
            .whereNull('deleted_at')
            .select('*'),
          knex('teachers')
            .where('user_id', user.id)
            .whereNull('deleted_at')
            .select('*'),
        ]);

      return res.json(user);
    }

    return res.status(404).json({ error: 'User not found.' });
  },

  async store(req, res, next) {
    const { username, email, born_date, phone } = req.body;
    const photo = req.file ? req.file.filename : undefined;

    try {
      const id = generateId();
      const password = await encript('null');

      const [user] = await knex('users')
        .insert({
          id,
          username,
          email,
          password,
          born_date,
          phone,
          photo,
        })
        .returning('*');

      user.password = undefined;

      const token = generate(
        {
          email,
        },
        EnumTokenTypes.EMAIL,
        '3 days'
      );

      await Queue.add(Queue.EnumQueuesTypes.SEND_MAIL, {
        to: email,
        emailType: EnumEmailTypes.REGISTER,
        properties: { token },
      });

      return res.json(user);
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

    const token = generate(
      {
        email,
      },
      EnumTokenTypes.EMAIL,
      '3 days'
    );

    try {
      const { statusCode, data: user } = await softUpdate('users', id, {
        username,
        password,
        active,
        email,
        born_date,
        phone,
        photo,
        email_confirmed: false,
      });

      if (statusCode === 202) {
        await Queue.add(Queue.EnumQueuesTypes.SEND_MAIL, {
          to: email,
          emailType: EnumEmailTypes.USER_CHANGE,
          properties: { token },
        });

        user.password = undefined;
      }

      return res.status(statusCode).json(user);
    } catch (err) {
      return res.status(406).json(err);
    }
  },

  async delete(req, res) {
    const { id } = req.params;

    return res.status(await softDelete('users', id)).send();
  },
};
