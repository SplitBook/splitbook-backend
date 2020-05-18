const express = require('express');

const LoginController = require('../controllers/LoginController');

const routes = express.Router();

routes.post('/login', LoginController.login);
routes.post('/register', LoginController.register);

module.exports = routes;
