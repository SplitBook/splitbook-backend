const { onUpdateTrigger } = require('../../../knexfile');

exports.up = async function (knex) {
  return knex.schema
    .createTable('requisition_states', (table) => {
      table.increments('id');
      table.string('state').notNullable();

      table.timestamps(true, true);
      table.timestamp('deleted_at');
      table.boolean('active').defaultTo(true);
    })
    .then(() =>
      knex.raw(
        'ALTER TABLE requisition_states ADD CONSTRAINT UQ_requisition_states UNIQUE (state, deleted_at);'
      )
    );
};

exports.down = async function (knex) {
  return knex.schema.dropTable('requisition_states');
};
