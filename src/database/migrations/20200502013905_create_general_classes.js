const { onUpdateTrigger } = require('../../../knexfile');

exports.up = async function (knex) {
  return knex.schema
    .createTable('general_classes', (table) => {
      table.increments('id');
      table.string('class').notNullable().unique();

      table.timestamps(true, true);
      table.timestamp('deleted_at');
      table.boolean('active').defaultTo(true);
    })
    .then(() => knex.raw(onUpdateTrigger('general_classes')));
};

exports.down = async function (knex) {
  return knex.schema.dropTable('general_classes');
};
