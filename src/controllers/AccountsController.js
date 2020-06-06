const knex = require('../database');
const { softDelete, softUpdate } = require('../utils/DatabaseOperations');
const EnumCharges = require('../utils/enums/EnumCharges');
const { createPagination } = require('../utils/PaginatorUtils');

module.exports = {
  /**
   * Search by:
   * Name
   * Email
   * Phone
   * Born Date
   * Username
   */
  async index(req, res, next) {
    const { search, page, limit, orderBy, desc } = req.query;

    try {
      const pagination = await createPagination(
        'accounts',
        { search, page, limit },
        {
          orderBy: orderBy || 'accounts.name',
          desc,
          selects: [
            'accounts.*',
            'users.email',
            'users.phone',
            'users.born_date',
            'users.photo',
            'users.username',
          ],
          searchColumns: [
            'name',
            'users.email',
            'users.phone',
            'users.born_date',
            'users.username',
          ],
          leftJoins: [['users', 'users.id', 'accounts.user_id']],
        }
      );

      return res.json(pagination);
    } catch (err) {
      return res.status(406).json(err);
    }
  },

  async get(req, res) {
    const { id } = req.params;

    const account = await knex('accounts')
      .select(
        'accounts.*',
        'users.email',
        'users.phone',
        'users.born_date',
        'users.photo',
        'users.username'
      )
      .where('accounts.id', id)
      .whereNull('accounts.deleted_at')
      .leftJoin('users', 'users.id', 'accounts.user_id')
      .first();

    if (account) {
      return res.json(account);
    }

    return res.status(404).json({ error: 'Account not found.' });
  },

  async store(req, res) {
    const { name, user_id, administrator } = req.body;
    const { charge } = administrator
      ? EnumCharges.ADMIN
      : EnumCharges.SECRETARY;

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
    const { charge } = administrator
      ? EnumCharges.ADMIN
      : EnumCharges.SECRETARY;

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
