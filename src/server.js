const express = require('express');
const cors = require('cors');
const path = require('path');

const routes = require('./routes/routes');
const authentication = require('./routes/authentication-routes');

const AuthenticationMiddleware = require('./middlewares/AuthenticationMiddleware');
const { errors } = require('celebrate');

require('dotenv').config();
require('./database');

const app = express();

app.use(cors());
app.use(express.json());
app.use(authentication);
app.use(AuthenticationMiddleware);
app.use(routes);
app.use(errors());

app.listen(process.env.PORT || 8085, () => {
  console.log(
    `⚡️ Server listening on http://localhost:${process.env.PORT || 8085}`
  );
});
