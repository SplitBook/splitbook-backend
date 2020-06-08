const EnumCharges = require('../../utils/enums/EnumCharges');

exports.up = async function (knex) {
  return knex.schema
    .createTable('guardians', (table) => {
      table.increments('id');
      table.string('name').notNullable();
      table.string('user_id', 36).unsigned().references('users.id');
      table
        .enu('charge', [EnumCharges.GUARDIAN.charge])
        .notNullable()
        .defaultTo(EnumCharges.GUARDIAN.charge);
      // .onDelete('RESTRICT');

      table.timestamps(true, true);
      table.timestamp('deleted_at');
      table.boolean('active').defaultTo(true);
    })
    .then(() =>
      knex.raw(
        'CREATE UNIQUE INDEX UQ_guardians ON guardians (user_id, deleted_at) WHERE user_id IS NOT NULL;'
      )
    );
};

exports.down = async function (knex) {
  return knex.schema.dropTable('guardians');
};
