const knex = require('../database');

/**
 *
 * @param {string} tableName Name of the table
 * @param {object} paginationOptions Object with the options of pagination
 * @param {object} queryOptions Object with the options of query
 * @param {number} paginationOptions.page Page Number
 * @param {number} paginationOptions.limit Number of items per page
 * @param {string} paginationOptions.search String to search on search columns
 */
async function createPagination(tableName, paginationOptions, queryOptions) {
  // console.log('params', { tableName, paginationOptions, queryOptions });

  const { page = 1, limit = 5, search = '' } = paginationOptions;
  let {
    selects = [`${tableName}.*`],
    innerJoins = [],
    leftJoins = [],
    searchColumns = [],
    orderBy = `${tableName}.created_at`,
    desc = false,
  } = queryOptions;

  const query = knex(tableName);

  innerJoins.forEach((elm) => {
    query.innerJoin(...elm);
  });

  leftJoins.forEach((elm) => {
    query.leftJoin(...elm);
  });

  searchColumns.forEach((elm) => {
    query.orWhere(elm, 'like', `%${search}%`);
  });

  query.andWhere(`${tableName}.deleted_at`, null);

  const querySelect = query.clone();
  const queryCount = query.clone();

  querySelect
    .select(...selects)
    .limit(limit)
    .offset((page - 1) * limit);

  if (Array.isArray(orderBy)) {
    orderBy.forEach((elm) => {
      querySelect.orderBy(elm, desc ? 'desc' : 'asc');
    });
  } else {
    querySelect.orderBy(orderBy, desc ? 'desc' : 'asc');
  }

  queryCount.count(`*`, { as: 'total_count' }).first();

  const data = await querySelect;
  const { total_count: totalCount } = await queryCount;

  return {
    data,
    page,
    length: data.length,
    limit,
    totalCount,
  };
}

module.exports = { createPagination };
