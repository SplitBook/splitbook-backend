const { encript } = require('../../utils/PasswordUtils');

exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('users')
    .del()
    .then(async function () {
      const password = await encript('admin');

      // Inserts seed entries
      return knex('users').insert({
        username: 'Admin',
        email: 'admin@splitbook.com',
        password,
        charge_id: 1,
      });
    });
};
