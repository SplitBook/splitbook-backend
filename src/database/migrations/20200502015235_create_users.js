exports.up = async function (knex) {
  return knex.schema
    .createTable('users', (table) => {
      table.string('id', 10).primary();
      table.string('username');
      table.string('email').notNullable(); //Cannot Change Email on Edit User
      table.string('password').notNullable();
      table.boolean('email_confirmed').defaultTo(false);
      table.string('phone');
      table.string('photo');
      table.date('born_date');

      table.timestamps(true, true);
      table.timestamp('deleted_at');
      table.boolean('active').defaultTo(true);
    })
    .then(() =>
      knex.raw(
        'ALTER TABLE users ADD CONSTRAINT UQ_users UNIQUE (email, deleted_at);'
      )
    );
};

exports.down = async function (knex) {
  return knex.schema.dropTable('users');
};
