exports.up = async function (knex) {
  return knex.schema
    .createTable('book_states', (table) => {
      table.increments('id');
      table.string('state').notNullable();

      table.timestamps(true, true);
      table.timestamp('deleted_at');
      table.boolean('active').defaultTo(true);
    })
    .then(() => {
      return knex('book_states').insert({
        state: `Novo`,
      });
    });
};

exports.down = async function (knex) {
  return knex.schema.dropTable('book_states');
};
