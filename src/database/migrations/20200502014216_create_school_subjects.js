const { onUpdateTrigger } = require('../../../knexfile');

exports.up = async function (knex) {
  return knex.schema
    .createTable('school_subjects', (table) => {
      table.increments('id');
      table.string('school_subject').notNullable();

      table.timestamps(true, true);
      table.timestamp('deleted_at');
      table.boolean('active').defaultTo(true);
    })
    .then(() => knex.raw(onUpdateTrigger('school_subjects')));
};

exports.down = async function (knex) {
  return knex.schema.dropTable('school_subjects');
};
