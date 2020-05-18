const { onUpdateTrigger } = require('../../../knexfile');

exports.up = async function (knex) {
  return knex.schema
    .createTable('requisitions', (table) => {
      table.increments('id');
      table.integer('school_enrollment_id').unsigned().notNullable();

      table.integer('state_id').unsigned().notNullable();

      table.foreign('state_id').references('requisition_states.id');
      table.foreign('school_enrollment_id').references('school_enrollments.id');

      table.timestamps(true, true);
      table.timestamp('deleted_at');
      table.boolean('active').defaultTo(true);

      table.unique(['school_enrollment_id', 'deleted_at']);
    })
    .then(() => knex.raw(onUpdateTrigger('requisitions')));
};

exports.down = async function (knex) {
  return knex.schema.dropTable('requisitions');
};
