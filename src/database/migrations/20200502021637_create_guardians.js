const { onUpdateTrigger } = require('../../../knexfile');
const EnumCharges = require('../../utils/enums/EnumCharges');

exports.up = async function (knex) {
  return knex.schema
    .createTable('guardians', (table) => {
      table.increments('id');
      table.string('name').notNullable();
      table.string('user_id', 10).unsigned().references('users.id');
      table
        .enu('charge', [EnumCharges.GUARDIAN])
        .notNullable()
        .defaultTo(EnumCharges.GUARDIAN);
      // .onDelete('RESTRICT');

      table.timestamps(true, true);
      table.timestamp('deleted_at');
      table.boolean('active').defaultTo(true);
    })
    .then(() =>
      knex.raw(
        'ALTER TABLE guardians ADD CONSTRAINT UQ_guardians UNIQUE (user_id, deleted_at);'
      )
    )
    .then(() => knex.raw(onUpdateTrigger('guardians')));
};

exports.down = async function (knex) {
  return knex.schema.dropTable('guardians');
};
