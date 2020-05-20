/*
 On soft delete, check value returned from database
 and return HTTP Status
 */
const knex = require('../database');

const softDelete = async (tableName, id, column_id = 'id') => {
  try {
    const result = await knex(tableName)
      .update({ deleted_at: new Date() })
      .where({ [column_id]: id })
      .whereNull('deleted_at');

    if (result > 0) {
      return 204;
    } else {
      return 404;
    }
  } catch (err) {
    console.warn(err);

    return 500;
  }
};

/*
 On soft update, check value returned from database
 and return HTTP Status
 */
const softUpdate = async (tableName, id, attributes, column_id = 'id') => {
  attributes.updated_at = new Date();

  const result = await knex(tableName)
    .update(attributes)
    .where({ [column_id]: id })
    .whereNull('deleted_at');

  if (result > 0) {
    return 202;
  } else {
    return 404;
  }
};

module.exports = {
  softDelete,
  softUpdate,
};
