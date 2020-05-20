const express = require('express');

const LoginController = require('../controllers/LoginController');

const LoginValidator = require('../validators/LoginValidator');

const routes = express.Router();

routes.post('/login', LoginValidator.login, LoginController.login);
routes.post('/register', LoginValidator.register, LoginController.register);
routes.post(
  '/recover-password',
  LoginValidator.recoverPassword,
  LoginController.recoverPassword
);

module.exports = routes;
