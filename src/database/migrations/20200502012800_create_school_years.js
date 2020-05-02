exports.up = function (knex) {
  return knex.schema.createTable('school_years', (table) => {
    table.increments('id');
    table.string('school_year', 9).notNullable().unique();

    table.timestamps(true, true);
    table.timestamp('deleted_at');
    table.boolean('active').defaultTo(true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('school_years');
};
