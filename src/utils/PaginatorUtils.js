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
    filter = {},
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

  query.where((builder) => {
    searchColumns.forEach((elm) => {
      builder.orWhere(`${elm}`, 'like', `%${search}%`);
    });
  });

  query.where((builder) => {
    Object.keys(filter).forEach((key) => {
      builder.whereIn(key, filter[key]);
    });
  });

  query.whereNull(`${tableName}.deleted_at`);

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

function getFiltersFromObject(object, filters = Object.keys(object)) {
  let filtersObject = {};

  filters.forEach((filter) => {
    const [key, keyRenamed] = filter.split(' as ');
    let filterValue = object[keyRenamed || key];

    if (filterValue) {
      filterValue = String(filterValue);

      filterValue = filterValue.split(',').map((elm) => {
        let element = elm.trim();
        return element.match(/^\d*$/) ? parseInt(element) : element;
      });

      filtersObject = {
        ...filtersObject,
        [key]: filterValue,
      };
    }
  });

  return filtersObject;
}

module.exports = { createPagination, getFiltersFromObject };
