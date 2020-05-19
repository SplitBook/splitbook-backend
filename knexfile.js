// Update with your config settings.
const path = require('path');
require('dotenv').config();

module.exports = {
  development: {
    client: 'mssql',
    connection: {
      server: process.env.DATABASE_SERVER,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: path.resolve(__dirname, 'src', 'database', 'migrations'),
    },
    seeds: {
      directory: path.resolve(__dirname, 'src', 'database', 'seeds'),
    },
    debug: true,
  },

  tests: {
    client: 'sqlite3',
    connection: {
      filename: './src/database/test.sqlite',
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: path.resolve(__dirname, 'src', 'database', 'migrations'),
    },
    seeds: {
      directory: path.resolve(__dirname, 'src', 'database', 'seeds'),
    },
    useNullAsDefault: true,
  },

  onUpdateTrigger: (table, table_id = 'id') => {
    var cl = '';

    if (Array.isArray(table_id)) {
      if (table_id.length > 1) cl += 'concat(';

      table_id.forEach((elm, idx) => {
        cl += `${elm}`;
        if (idx < table_id.length - 1) cl += `, `;
      });

      if (table_id.length > 1) cl += ')';
    } else {
      cl = table_id;
    }

    return ``;
  },
};
