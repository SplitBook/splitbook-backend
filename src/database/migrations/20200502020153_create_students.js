exports.up = function (knex) {
  return knex.schema.createTable('students', (table) => {
    table.increments('id');
    table.string('name').notNullable();
    table.string('numero', 7).notNullable().unique();
    table.string('photo');
    table.date('born_date');

    table.timestamps(true, true);
    table.timestamp('deleted_at');
    table.boolean('active').defaultTo(true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('students');
};
