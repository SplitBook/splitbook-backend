const { onUpdateTrigger } = require('../../../knexfile');

exports.up = async function (knex) {
  return knex.schema
    .createTable('book_requisitions', (table) => {
      table.integer('adopted_book_id').unsigned();
      table.integer('requisition_id').unsigned();

      // table.primary([
      //   'school_subject_id',
      //   'class_id',
      //   'school_year_id',
      //   'book_isbn',
      //   'requisition_id',
      // ]);

      table.primary(['adopted_book_id', 'requisition_id']);

      table
        .foreign('adopted_book_id')
        .references('id')
        .inTable('adopted_books');

      table.foreign('requisition_id').references('requisitions.id');

      table.timestamps(true, true);
      table.timestamp('deleted_at');
      table.boolean('active').defaultTo(true);
    })
    .then(() => knex.raw(onUpdateTrigger('book_requisitions')));
};

exports.down = async function (knex) {
  return knex.schema.dropTable('book_requisitions');
};
