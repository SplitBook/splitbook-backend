exports.up = function (knex) {
  return knex.schema.createTable('requisition_states', (table) => {
    table.increments('id');
    table.string('state').notNullable().unique();

    table.timestamps(true, true);
    table.timestamp('deleted_at');
    table.boolean('active').defaultTo(true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('requisition_states');
};
