const { onUpdateTrigger } = require('../../../knexfile');

exports.up = async function (knex) {
  return knex.schema
    .createTable('adopted_books', (table) => {
      table.integer('school_subject_id').unsigned();
      table.integer('class_id').unsigned();
      table.integer('school_year_id').unsigned();
      table.string('book_isbn');

      table.primary([
        'school_subject_id',
        'class_id',
        'school_year_id',
        'book_isbn',
      ]);

      table
        .foreign(['school_year_id', 'class_id', 'school_subject_id'])
        .references(['school_year_id', 'class_id', 'school_subject_id'])
        .inTable('resumes');

      table.foreign('book_isbn').references('books.isbn');

      table.timestamps(true, true);
      table.timestamp('deleted_at');
      table.boolean('active').defaultTo(true);
    })
    .then(() => knex.raw(onUpdateTrigger('adopted_books')));
};

exports.down = async function (knex) {
  return knex.schema.dropTable('adopted_books');
};
