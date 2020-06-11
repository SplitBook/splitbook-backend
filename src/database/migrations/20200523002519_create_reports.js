const EnumConfigs = require('../../utils/enums/EnumConfigs');

exports.up = async function (knex) {
  return knex.schema.createTable('reports', (table) => {
    table.string('id', 36).primary();
    table.string('type').notNullable();
    table.string('file_signed');
    table.string('file');
    table.integer('requisition_id').unsigned().notNullable();

    table.foreign('requisition_id').references('requisitions.id');

    table.timestamps(true, true);
    table.timestamp('deleted_at');
    table.boolean('active').defaultTo(true);
  });
  // .then(() => {
  //   return knex.schema.alterTable('deliveries', (t) => {
  //     t.string('report_id', 36).notNullable();

  //     t.foreign('report_id').references('id').inTable('reports');
  //   });
  // })
  // .then(() => {
  //   return knex.schema.alterTable('returns', (t) => {
  //     t.string('report_id', 36).notNullable();

  //     t.foreign('report_id').references('id').inTable('reports');
  //   });
  // });
};

exports.down = async function (knex) {
  return knex.schema.dropTable('reports');
};
