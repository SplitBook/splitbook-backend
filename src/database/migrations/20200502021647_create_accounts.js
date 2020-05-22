const { onUpdateTrigger } = require('../../../knexfile');
const EnumCharges = require('../../utils/enums/EnumCharges');

exports.up = async function (knex) {
  return knex.schema
    .createTable('accounts', (table) => {
      table.increments('id');
      table.string('name').notNullable();
      table.string('user_id', 10).unsigned().references('users.id');
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
        'ALTER TABLE accounts ADD CONSTRAINT UQ_accounts UNIQUE (user_id, deleted_at);'
      )
    );
};

exports.down = async function (knex) {
  return knex.schema.dropTable('accounts');
};
