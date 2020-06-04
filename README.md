# SPLITBOOK 📚🏫

## Getting Started

- Run SQL Server
  `docker run -e 'ACCEPT_EULA=Y' -e 'SA_PASSWORD=<YOUR-PASSWORD>' --name mssql-server -p 1433:1433 -v mssql-data:/var/opt/mssql/data -d mcr.microsoft.com/mssql/server:2017-latest`

- Run Redis Database
  `docker run --name redis-server -p 6379:6379 -d redis:alpine`

- Run npm install
  `npm install`

- Create database on SQL Server (Example: **CREATE DATABASE split_book COLLATE SQL_Latin1_General_CP1_CS_AS**)

  ### IMPORTANT

  - Set _collate_ as case sensitive

- Set environment variables on _.env_ file

- Run **knex migrations** and **default seeds**
  `npx knex migrate:latest`
  `npx knex seed:run`

- Run`npm start`

## Run

- Start docker containers

  - `docker start mssql-server`
  - `docker start redis-server`

* Run `npm start`
