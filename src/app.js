require('dotenv').config();
const express = require('express');

const app = express();

app.listen(process.env.PORT || 8085, () => {
    console.log(`⚡️ Server listening on http://localhost:${process.env.PORT || 8085}`);
});