exports.up = function (knex) {
  return knex.schema.createTable('charges', (table) => {
    table.increments('id');
    table.string('charge').notNullable();

    table.timestamps(true, true);
    table.timestamp('deleted_at');
    table.boolean('active').defaultTo(true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('charges');
};
