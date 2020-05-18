const { onUpdateTrigger } = require('../../../knexfile');

exports.up = async function (knex) {
  return knex.schema
    .createTable('requisition_states', (table) => {
      table.increments('id');
      table.string('state').notNullable();

      table.timestamps(true, true);
      table.timestamp('deleted_at');
      table.boolean('active').defaultTo(true);

      table.unique(['state', 'deleted_at']);
    })
    .then(() => knex.raw(onUpdateTrigger('requisition_states')));
};

exports.down = async function (knex) {
  return knex.schema.dropTable('requisition_states');
};
