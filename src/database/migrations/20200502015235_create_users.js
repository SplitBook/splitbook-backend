const { onUpdateTrigger } = require('../../../knexfile');

exports.up = async function (knex) {
  return knex.schema
    .createTable('users', (table) => {
      table.increments('id');
      table.string('username');
      table.string('email').notNullable().unique();
      table.string('password').notNullable();
      table
        .integer('charge_id')
        .unsigned()
        .references('charges.id')
        .onDelete('RESTRICT');

      table.timestamps(true, true);
      table.timestamp('deleted_at');
      table.boolean('active').defaultTo(true);
    })
    .then(() => knex.raw(onUpdateTrigger('users')));
};

exports.down = async function (knex) {
  return knex.schema.dropTable('users');
};
