exports.up = function (knex) {
  return knex.schema.createTable('classes', (table) => {
    table
      .integer('school_year_id')
      .unsigned()
      .references('school_years.id')
      .onDelete('RESTRICT');
    table
      .integer('class_id')
      .unsigned()
      .references('general_classes.id')
      .onDelete('RESTRICT');
    table
      .integer('head_class_id')
      .unsigned()
      .references('teachers.id')
      .onDelete('RESTRICT');

    table.primary(['school_year_id', 'class_id']);

    table.timestamps(true, true);
    table.timestamp('deleted_at');
    table.boolean('active').defaultTo(true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('classes');
};
