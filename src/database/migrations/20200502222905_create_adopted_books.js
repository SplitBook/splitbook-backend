const { onUpdateTrigger } = require('../../../knexfile');

exports.up = async function (knex) {
  return knex.schema
    .createTable('adopted_books', (table) => {
      table.increments('id');
      table.integer('resume_id').unsigned();
      table.string('book_isbn');

      // TODO Unique constraint resume_id && book_id
      table.unique(['resume_id', 'book_isbn']);

      table.foreign(['resume_id']).references(['id']).inTable('resumes');

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
