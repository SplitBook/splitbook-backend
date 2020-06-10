const EnumConfigs = require('../../utils/enums/EnumConfigs');

exports.up = async function (knex) {
  return knex.schema
    .createTable('configs', (table) => {
      table.string('key').primary();
      table.string('value').notNullable();

      table.boolean('active').defaultTo(true);
    })
    .then(() => {
      return knex('configs').insert([
        {
          key: EnumConfigs.CURRENT_SCHOOL_YEAR_ID.key,
          value: String(EnumConfigs.CURRENT_SCHOOL_YEAR_ID.defaultValue),
        },
        {
          key: EnumConfigs.DEFAULT_REQUISITION_STATE_ID.key,
          value: String(EnumConfigs.DEFAULT_REQUISITION_STATE_ID.defaultValue),
        },
        {
          key: EnumConfigs.DEFAULT_BOOK_STATE_ID.key,
          value: String(EnumConfigs.DEFAULT_BOOK_STATE_ID.defaultValue),
        },
        {
          key: EnumConfigs.BLOCKED_REQUISITION_IDS.key,
          value: EnumConfigs.BLOCKED_REQUISITION_IDS.defaultValue,
        },
      ]);
    });
};

exports.down = async function (knex) {
  return knex.schema.dropTable('configs');
};
