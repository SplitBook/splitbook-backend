const { onUpdateTrigger } = require('../../../knexfile');

exports.up = async function (knex) {
  return knex.schema
    .createTable('school_enrollments', (table) => {
      table.increments('id');
      table.integer('student_id').unsigned().notNullable();
      table.integer('guardian_id').unsigned().notNullable();
      table.integer('requisition_id').unsigned().unique();
      table.integer('school_year_id').unsigned().notNullable();
      table.integer('class_id').unsigned().notNullable();

      table.foreign('student_id').references('students.id');
      table.foreign('guardian_id').references('guardians.id');
      table.foreign('requisition_id').references('requisitions.id');
      table
        .foreign(['school_year_id', 'class_id'])
        .references(['school_year_id', 'class_id'])
        .inTable('classes');

      table.timestamps(true, true);
      table.timestamp('deleted_at');
      table.boolean('active').defaultTo(true);
    })
    .then(() => knex.raw(onUpdateTrigger('school_enrollments')));
};

exports.down = async function (knex) {
  return knex.schema.dropTable('school_enrollments');
};
