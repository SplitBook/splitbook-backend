const EnumCharges = require('../../utils/enums/EnumCharges');

exports.up = async function (knex) {
  return knex.schema
    .createTable('accounts', (table) => {
      table.increments('id');
      table.string('name').notNullable();
      table.string('user_id', 36).unsigned().references('users.id');
      // .onDelete('RESTRICT');
      table
        .enu('charge', [EnumCharges.ADMIN.charge, EnumCharges.SECRETARY.charge])
        .notNullable()
        .defaultTo(EnumCharges.SECRETARY.charge);
      table.timestamps(true, true);
      table.timestamp('deleted_at');
      table.boolean('active').defaultTo(true);
    })
    .then(() =>
      knex.raw(
        'CREATE UNIQUE INDEX UQ_accounts ON accounts (user_id, deleted_at) WHERE user_id IS NOT NULL;'
      )
    );
};

exports.down = async function (knex) {
  return knex.schema.dropTable('accounts');
};
