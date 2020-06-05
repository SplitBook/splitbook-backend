const knex = require('../database');
const { softDelete, softUpdate } = require('../utils/DatabaseOperations');
const EnumCharges = require('../utils/enums/EnumCharges');

module.exports = {
  async searchUsers(req, res, next) {
    const { search, page, limit } = req.query;
    let nextPage = false;

    let users = await knex
      .select('*')
      .where('email', 'like', `%${search}%`)
      .orWhere('username', 'like', `%${search}%`)
      .orWhere('phone', 'like', `%${search}%`)
      .orWhere('born_date', 'like', `%${search}%`)
      .whereNull('deleted_at')
      .from('users')
      .limit(limit + 1)
      .offset((page - 1) * limit)
      .orderBy('created_at');

    if (users.length > limit) {
      nextPage = true;
      users = users.slice(0, limit);
    }

    users = users.map((user) => {
      user.password = undefined;
      return user;
    });

    return res.json({
      users,
      page,
      pageCount: users.length,
      limit,
      nextPage,
    });
  },
};
