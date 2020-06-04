exports.up = async function (knex) {
  return knex.schema
    .createTable('requisitions_physical_book', (table) => {
      table.increments('id');
      table.string('physical_book_id', 12).notNullable();
      table.integer('book_requisition_id').unsigned().notNullable();
      table.date('delivery_date');
      table.date('return_date');

      table
        .foreign('physical_book_id')
        .references('id')
        .inTable('physical_books');

      table
        .foreign('book_requisition_id')
        .references('id')
        .inTable('book_requisitions');

      table.timestamps(true, true);
      table.timestamp('deleted_at');
      table.boolean('active').defaultTo(true);
    })
    .then(() =>
      knex.raw(
        'ALTER TABLE requisitions_physical_book ADD CONSTRAINT UQ_requisitions_physical_book UNIQUE (book_requisition_id, deleted_at);'
      )
    );
};

exports.down = async function (knex) {
  return knex.schema.dropTable('requisitions_physical_book');
};
