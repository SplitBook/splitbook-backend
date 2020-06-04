exports.up = async function (knex) {
  return knex.schema.createTable('physical_books', (table) => {
    table.string('id', 12).primary();
    table.string('book_isbn', 15);
    table.boolean('available').defaultTo(true);
    table.integer('state_id').unsigned();
    table.integer('location_id').unsigned();
    table.string('description');

    table.foreign('state_id').references('id').inTable('book_states');
    table.foreign('location_id').references('id').inTable('book_locations');
    table.foreign('book_isbn').references('isbn').inTable('books');

    table.timestamps(true, true);
    table.timestamp('deleted_at');
    table.boolean('active').defaultTo(true);
  });
};

exports.down = async function (knex) {
  return knex.schema.dropTable('physical_books');
};
