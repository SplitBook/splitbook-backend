const { onUpdateTrigger } = require('../../../knexfile');

exports.up = async function (knex) {
  return knex.schema
    .createTable('books', (table) => {
      table.string('isbn', 15).primary();
      table.string('name').notNullable();
      table.string('publishing_company');
      table.string('cover');
      table
        .integer('subject_id')
        .unsigned()
        .references('school_subjects.id')
        .onDelete('RESTRICT');

      table.timestamps(true, true);
      table.timestamp('deleted_at');
      table.boolean('active').defaultTo(true);
    })
    .then(() => knex.raw(onUpdateTrigger('books')));
};

exports.down = async function (knex) {
  return knex.schema.dropTable('books');
};
