const express = require('express');
const path = require('path');

const LoginController = require('../controllers/LoginController');
const PasswordController = require('../controllers/PasswordController');

const LoginValidator = require('../validators/LoginValidator');
const PasswordValidator = require('../validators/PasswordValidator');

const routes = express.Router();

routes.use(
  '/images',
  express.static(path.resolve(__dirname, '..', '..', 'tmp', 'uploads'))
);

routes.use(
  '/reports',
  express.static(path.resolve(__dirname, '..', '..', 'tmp', 'reports'))
);

routes.post('/login', LoginValidator.login, LoginController.login);
routes.post('/login/profile', LoginValidator.profile, LoginController.profile);
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
