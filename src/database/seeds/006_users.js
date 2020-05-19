const { encript } = require('../../utils/PasswordUtils');
const { generateId } = require('../../utils/UserUtils');

exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('users')
    .del()
    .then(async function () {
      const id = await generateId();
      const password = await encript('admin');

      // Inserts seed entries
      return knex('users').insert({
        id,
        username: 'Admin',
        email: 'admin@splitbook.com',
        password,
        charge_id: 1,
      });
    });
};
