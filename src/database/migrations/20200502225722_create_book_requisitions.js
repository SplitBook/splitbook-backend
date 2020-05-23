exports.up = async function (knex) {
  return knex.schema
    .createTable('book_requisitions', (table) => {
      table.increments('id');
      table.integer('adopted_book_id').unsigned();
      table.integer('requisition_id').unsigned();

      table
        .foreign('adopted_book_id')
        .references('id')
        .inTable('adopted_books');

      table.foreign('requisition_id').references('requisitions.id');

      table.timestamps(true, true);
      table.timestamp('deleted_at');
      table.boolean('active').defaultTo(true);
    })
    .then(() =>
      knex.raw(
        'ALTER TABLE book_requisitions ADD CONSTRAINT UQ_book_requisitions UNIQUE (adopted_book_id, requisition_id, deleted_at);'
      )
    );
};

exports.down = async function (knex) {
  return knex.schema.dropTable('book_requisitions');
};
