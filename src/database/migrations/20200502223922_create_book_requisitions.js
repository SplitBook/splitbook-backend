const { onUpdateTrigger } = require('../../../knexfile');

exports.up = async function (knex) {
  return knex.schema
    .createTable('book_requisitions', (table) => {
      table.integer('school_subject_id').unsigned();
      table.integer('class_id').unsigned();
      table.integer('school_year_id').unsigned();
      table.string('book_isbn');
      table.integer('requisition_id').unsigned();

      table.primary([
        'school_subject_id',
        'class_id',
        'school_year_id',
        'book_isbn',
        'requisition_id',
      ]);

      table
        .foreign([
          'school_year_id',
          'class_id',
          'school_subject_id',
          'book_isbn',
        ])
        .references([
          'school_year_id',
          'class_id',
          'school_subject_id',
          'book_isbn',
        ])
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
