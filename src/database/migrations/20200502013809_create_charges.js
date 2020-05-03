const { onUpdateTrigger } = require('../../../knexfile');

exports.up = async function (knex) {
  return knex.schema
    .createTable('charges', (table) => {
      table.increments('id');
      table.string('charge').notNullable();

      table.timestamps(true, true);
      table.timestamp('deleted_at');
      table.boolean('active').defaultTo(true);
    })
    .then(() => knex.raw(onUpdateTrigger('charges')));
};

exports.down = async function (knex) {
  return knex.schema.dropTable('charges');
};
