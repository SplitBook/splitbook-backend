const { encript } = require('../../utils/PasswordUtils');
const { generateId } = require('../../utils/UserUtils');
const EnumCharges = require('../../utils/enums/EnumCharges');

exports.seed = async function (knex) {
  // Deletes ALL existing entries
  const id = await generateId();
  const password = await encript('admin');

  return knex('users')
    .del()
    .then(async function () {
      // Inserts seed entries
      return knex('users').insert({
        id,
        username: 'Admin',
        email: 'admin@splitbook.com',
        email_confirmed: true,
        password,
      });
    })
    .then(() =>
      knex('accounts')
        .del()
        .then(() => {
          return knex('accounts').insert({
            user_id: id,
            name: 'Administrador',
            charge: EnumCharges.ADMIN.charge,
          });
        })
    );
};
