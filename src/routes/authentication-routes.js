const express = require('express')
const path = require('path')

const LoginController = require('../controllers/LoginController')
const PasswordController = require('../controllers/PasswordController')
const PhysicalBooksController = require('../controllers/PhysicalBooksController')
const TokenController = require('../controllers/TokenController')

const LoginValidator = require('../validators/LoginValidator')
const PasswordValidator = require('../validators/PasswordValidator')
const PhysicalBooksValidator = require('../validators/PhysicalBooksValidator')

const routes = express.Router()

routes.use(
  '/images',
  express.static(path.resolve(__dirname, '..', '..', 'tmp', 'uploads'))
)

routes.use(
  '/reports',
  express.static(path.resolve(__dirname, '..', '..', 'tmp', 'reports'))
)

routes.post('/login', LoginValidator.login, LoginController.login)
routes.post('/login/profile', LoginValidator.profile, LoginController.profile)
routes.post(
  '/recover-password',
  PasswordValidator.recoverPassword,
  PasswordController.recoverPassword
)
routes.post(
  '/change-password',
  PasswordValidator.changePassword,
  PasswordController.changePassword
)

// JWT Token Config
routes.get('/jwt/public-key', TokenController.getPublicKey)

routes.get(
  '/app/physical-books/:id',
  PhysicalBooksValidator.get,
  PhysicalBooksController.get
)

module.exports = routes
