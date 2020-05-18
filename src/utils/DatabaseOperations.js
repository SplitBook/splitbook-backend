/*
 On soft delete, check value returned from database
 and return HTTP Status
 */
const knex = require('../database');

const softDelete = async (tableName, id) => {
  try {
    const result = await knex(tableName)
      .update({ deleted_at: new Date() })
      .where('id', id)
      .whereNull('deleted_at');

    if (result > 0) {
      return 204;
    } else {
      return 404;
    }
  } catch (err) {
    console.log(err);

    return 500;
  }
};

const softUpdate = async (tableName, id, atributes) => {
  try {
    const result = await knex(tableName)
      .update(atributes)
      .where('id', id)
      .whereNull('deleted_at');

    if (result > 0) {
      return 202;
    } else {
      return 404;
    }
  } catch (err) {
    console.log(err);
    return 500;
  }
};

module.exports = {
  softDelete,
  softUpdate,
};
