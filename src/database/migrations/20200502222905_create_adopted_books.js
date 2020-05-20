const { onUpdateTrigger } = require('../../../knexfile');

exports.up = async function (knex) {
  return knex.schema
    .createTable('adopted_books', (table) => {
      table.increments('id');
      table.integer('resume_id').unsigned();
      table.string('book_isbn', 15);

      table.foreign('resume_id').references('id').inTable('resumes');

      table.foreign('book_isbn').references('isbn').inTable('books');

      table.timestamps(true, true);
      table.timestamp('deleted_at');
      table.boolean('active').defaultTo(true);
    })
    .then(() =>
      knex.raw(
        'ALTER TABLE adopted_books ADD CONSTRAINT UQ_adopted_books UNIQUE (book_isbn, resume_id, deleted_at);'
      )
    )
    .then(() => knex.raw(onUpdateTrigger('adopted_books')));
};

exports.down = async function (knex) {
  return knex.schema.dropTable('adopted_books');
};
