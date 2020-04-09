const express = require('express');

const HandbookController = require('./controllers/HandbookController');

const routes = express.Router();

// Handbook
routes.get('/handbooks', HandbookController.index);
routes.post('/handbooks', HandbookController.store);
routes.put('/handbooks/:id', HandbookController.edit);
routes.delete('/handbooks/:id', HandbookController.delete);

module.exports = routes;
