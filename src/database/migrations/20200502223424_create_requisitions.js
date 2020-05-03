const { onUpdateTrigger } = require('../../../knexfile');

exports.up = async function (knex) {
  return knex.schema
    .createTable('requisitions', (table) => {
      table.increments('id');

      table.integer('state_id').unsigned().notNullable();

      table.foreign('state_id').references('requisition_states.id');

      table.timestamps(true, true);
      table.timestamp('deleted_at');
      table.boolean('active').defaultTo(true);
    })
    .then(() => knex.raw(onUpdateTrigger('requisitions')));
};

exports.down = async function (knex) {
  return knex.schema.dropTable('requisitions');
};
