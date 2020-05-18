const { onUpdateTrigger } = require('../../../knexfile');

exports.up = async function (knex) {
  return knex.schema
    .createTable('students', (table) => {
      table.increments('id');
      table.string('name').notNullable();
      table.string('number', 7).notNullable().unique();
      table.string('photo');
      table.date('born_date');

      table.timestamps(true, true);
      table.timestamp('deleted_at');
      table.boolean('active').defaultTo(true);
    })
    .then(() => knex.raw(onUpdateTrigger('students')));
};

exports.down = async function (knex) {
  return knex.schema.dropTable('students');
};
