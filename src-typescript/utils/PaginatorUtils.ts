import knex from 'knex'

type PaginationOptions = {
  page?: number
  limit?: number
  search?: string
}

type QueryOptions = {
  selects?: string[]
  innerJoins?: string[][]
  leftJoins?: string[]
  multipleInnerJoins?: string[]
  searchColumns?: string[]
  filter?: object
  orderBy?: string | string[]
  desc?: boolean
}

async function createPagination(
  tableName: string,
  { page = 1, limit = 5, search = '' }: PaginationOptions,
  {
    selects = [`${tableName}.*`],
    innerJoins = [],
    leftJoins = [],
    multipleInnerJoins = [],
    searchColumns = [],
    filter = {},
    orderBy = `${tableName}.created_at`,
    desc = false
  }: QueryOptions
) {
  const query = knex(tableName)

  innerJoins.forEach(elm => {
    query.innerJoin(...elm)
  })

  leftJoins.forEach(elm => {
    query.leftJoin(...elm)
  })

  multipleInnerJoins.forEach(elm => {
    query.innerJoin(elm.table, obj => {
      elm.joins.forEach(e => {
        obj.on(...e)
      })
    })
  })

  if (search) {
    query.where(builder => {
      searchColumns.forEach(elm => {
        builder.orWhere(`${elm}`, 'like', `%${search}%`)
      })
    })
  }

  query.where(builder => {
    Object.keys(filter).forEach(key => {
      builder.whereIn(key, filter[key])
    })
  })

  query.whereNull(`${tableName}.deleted_at`)

  const querySelect = query.clone()
  const queryCount = query.clone()

  querySelect
    .select(...selects)
    .limit(limit)
    .offset((page - 1) * limit)

  if (Array.isArray(orderBy)) {
    orderBy.forEach(elm => {
      querySelect.orderBy(elm, desc ? 'desc' : 'asc')
    })
  } else {
    querySelect.orderBy(orderBy, desc ? 'desc' : 'asc')
  }

  queryCount.count('*', { as: 'total_count' }).first()

  const data = await querySelect
  const { total_count: totalCount } = await queryCount

  return {
    data,
    page,
    length: data.length,
    limit,
    totalCount
  }
}
