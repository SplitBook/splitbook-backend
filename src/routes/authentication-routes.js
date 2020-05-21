const express = require('express');

const LoginController = require('../controllers/LoginController');
const PasswordController = require('../controllers/PasswordController');

const LoginValidator = require('../validators/LoginValidator');
const PasswordValidator = require('../validators/PasswordValidator');

const routes = express.Router();

routes.post('/login', LoginValidator.login, LoginController.login);
// routes.post('/register', LoginValidator.register, LoginController.register);
routes.post(
  '/recover-password',
  PasswordValidator.recoverPassword,
  PasswordController.recoverPassword
);
routes.post(
  '/change-password',
  PasswordValidator.changePassword,
  PasswordController.changePassword
);

module.exports = routes;
