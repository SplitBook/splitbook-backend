exports.up = async function (knex) {
  return knex.schema
    .createTable('deliveries', (table) => {
      table.increments('id');
      table.integer('requisition_physical_book_id').unsigned().notNullable();
      table.integer('book_state_id').unsigned().notNullable();
      table.string('report_id', 36).notNullable();

      table.foreign('report_id').references('id').inTable('reports');
      table
        .foreign('requisition_physical_book_id')
        .references('id')
        .inTable('requisitions_physical_book');

      table.foreign('book_state_id').references('id').inTable('book_states');

      table.timestamps(true, true);
      table.timestamp('deleted_at');
      table.boolean('active').defaultTo(true);
    })
    .then(() =>
      knex.raw(
        'ALTER TABLE deliveries ADD CONSTRAINT UQ_deliveries UNIQUE (requisition_physical_book_id, deleted_at);'
      )
    );
};

exports.down = async function (knex) {
  return knex.schema.dropTable('deliveries');
};
