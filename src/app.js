const express = require('express');
const routes = require('./routes');
const Msg = require('./commons/Messages');

require('dotenv').config();
require('./database');

const app = express();

app.use(express.json());
app.use(routes);

app.listen(process.env.PORT || 8085, () => {
    console.log(`⚡️ Server listening on http://localhost:${process.env.PORT || 8085}`);
});