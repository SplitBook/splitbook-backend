exports.up = async function (knex) {
  return knex.schema.createTable('books', table => {
    table.string('isbn').primary()
    table.string('name').notNullable()
    table.string('publishing_company')
    table.string('cover')
    table.integer('subject_id').unsigned().references('school_subjects.id')
    table.string('code', 5).notNullable()
    table
      .integer('physical_books_quantity')
      .unsigned()
      .defaultTo(0)
      .notNullable()

    // .onDelete('RESTRICT');

    table.timestamps(true, true)
    table.timestamp('deleted_at')
    table.boolean('active').defaultTo(true)
  })
}

exports.down = async function (knex) {
  return knex.schema.dropTable('books')
}
