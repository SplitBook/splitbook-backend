exports.up = async function (knex) {
  return knex.schema.createTable('book_locations', (table) => {
    table.increments('id');
    table.string('location').notNullable();

    table.timestamps(true, true);
    table.timestamp('deleted_at');
    table.boolean('active').defaultTo(true);
  });
};

exports.down = async function (knex) {
  return knex.schema.dropTable('book_locations');
};
