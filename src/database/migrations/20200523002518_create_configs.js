exports.up = async function (knex) {
  return knex.schema
    .createTable('configs', (table) => {
      table.string('key').primary();
      table.string('value').notNullable();

      table.boolean('active').defaultTo(true);
    })
    .then(() => {
      return knex('configs').insert({ key: 'school_year_id', value: '1' });
    });
};

exports.down = async function (knex) {
  return knex.schema.dropTable('configs');
};
