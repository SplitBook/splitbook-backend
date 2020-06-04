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

  const [data] = await knex(tableName)
    .update(attributes)
    .where({ [column_id]: id })
    .whereNull('deleted_at')
    .returning('*');

  if (data) {
    return { statusCode: 202, data };
  } else {
    return { statusCode: 404, data: { error: 'Not Found' } };
  }
};

module.exports = {
  softDelete,
  softUpdate,
};
