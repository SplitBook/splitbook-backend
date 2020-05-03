const { onUpdateTrigger } = require('../../../knexfile');

exports.up = async function (knex) {
  return knex.schema
    .createTable('teachers', (table) => {
      table.increments('id');
      table.string('name').notNullable();
      table.string('phone');
      table.string('photo');
      table.date('born_date');
      table
        .integer('user_id')
        .unsigned()
        .unique()
        .references('users.id')
        .onDelete('RESTRICT');

      table.timestamps(true, true);
      table.timestamp('deleted_at');
      table.boolean('active').defaultTo(true);
    })
    .then(() => knex.raw(onUpdateTrigger('teachers')));
};

exports.down = async function (knex) {
  return knex.schema.dropTable('teachers');
};
