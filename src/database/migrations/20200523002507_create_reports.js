exports.up = async function (knex) {
  return knex.schema.createTable('reports', (table) => {
    table.string('id', 36).primary();
    table.integer('requisition_id').unsigned().notNullable();
    table.string('type').notNullable();
    table.string('file_signed');
    table.string('file');
    table.date('report_date').defaultTo(knex.fn.now(6));
    table.boolean('valid').defaultTo(false);
    table.boolean('is_file_signed').defaultTo(false);
    table.text('description', 'longtext');

    table.foreign('requisition_id').references('requisitions.id');

    table.timestamps(true, true);
    table.timestamp('deleted_at');
    table.boolean('active').defaultTo(true);
  });
};

exports.down = async function (knex) {
  return knex.schema.dropTable('reports');
};
