exports.up = async function (knex) {
  return knex.schema
    .createTable('general_classes', (table) => {
      table.increments('id');
      table.string('class').notNullable();

      table.timestamps(true, true);
      table.timestamp('deleted_at');
      table.boolean('active').defaultTo(true);
    })
    .then(() =>
      knex.raw(
        'ALTER TABLE general_classes ADD CONSTRAINT UQ_general_classes UNIQUE (class, deleted_at);'
      )
    );
};

exports.down = async function (knex) {
  return knex.schema.dropTable('general_classes');
};
