const { onUpdateTrigger } = require('../../../knexfile');

exports.up = async function (knex) {
  return knex.schema
    .createTable('school_years', (table) => {
      table.increments('id');
      table.string('school_year', 9).notNullable();

      table.timestamps(true, true);
      table.timestamp('deleted_at');
      table.boolean('active').defaultTo(true);

      table.unique(['school_year', 'deleted_at']);
    })
    .then(() => knex.raw(onUpdateTrigger('school_years')));
};

exports.down = async function (knex) {
  return knex.schema.dropTable('school_years', 'id');
};
