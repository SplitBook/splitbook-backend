exports.up = function (knex) {
  return knex.schema.createTable('resumes', (table) => {
    table.integer('school_subject_id').unsigned();
    table.integer('class_id').unsigned();
    table.integer('school_year_id').unsigned();

    table.primary(['school_subject_id', 'class_id', 'school_year_id']);

    table
      .foreign(['school_year_id', 'class_id'])
      .references(['school_year_id', 'class_id'])
      .inTable('classes');

    table.foreign('school_subject_id').references('school_subjects.id');

    table.timestamps(true, true);
    table.timestamp('deleted_at');
    table.boolean('active').defaultTo(true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('resumes');
};
