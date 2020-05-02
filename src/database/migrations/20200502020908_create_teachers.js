exports.up = function (knex) {
  return knex.schema.createTable('teachers', (table) => {
    table.increments('id');
    table.string('name').notNullable();
    table.string('phone');
    table.string('photo');
    table.date('born_date');
    table
      .integer('user_id')
      .unsigned()
      .unique()
      .references('users.id')
      .onDelete('RESTRICT');

    table.timestamps(true, true);
    table.timestamp('deleted_at');
    table.boolean('active').defaultTo(true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('teachers');
};
