const express = require('express');
const path = require('path');
const multer = require('multer');

const multerImagesConfig = require('../config/multerImagesConfig');

// const HandbookController = require('./controllers/HandbookController');
const SchoolYearsController = require('../controllers/SchoolYearsController');
const ChargesController = require('../controllers/ChargesController');
const GeneralClassesController = require('../controllers/GeneralClassesController');
const RequisitionStatesController = require('../controllers/RequisitionStatesController');
const SchoolSubjectsController = require('../controllers/SchoolSubjectsController');
const BooksController = require('../controllers/BooksController');
const UsersController = require('../controllers/UsersController');
const GuardiansController = require('../controllers/GuardiansController');
const TeachersController = require('../controllers/TeachersController');
const StudentsController = require('../controllers/StudentsController');
const ClassesController = require('../controllers/ClassesController');

const SchoolYearsValidator = require('../validators/SchoolYearsValidator');
const ChargesValidator = require('../validators/ChargesValidator');
const GeneralClassesValidator = require('../validators/GeneralClassesValidator');
const RequisitionStatesValidator = require('../validators/RequisitionStatesValidator');
const SchoolSubjectsValidator = require('../validators/SchoolSubjectsValidator');
const BooksValidator = require('../validators/BooksValidator');
const UsersValidator = require('../validators/UsersValidator');
const GuardiansValidator = require('../validators/GuardiansValidator');
const TeachersValidator = require('../validators/TeachersValidator');
const StudentsValidator = require('../validators/StudentsValidator');
const ClassesValidator = require('../validators/ClassesValidator');

const routes = express.Router();

routes.use(
  '/images',
  express.static(path.resolve(__dirname, '..', '..', 'tmp', 'uploads'))
);

// School Years
routes.get('/school-years', SchoolYearsController.index);
routes.post(
  '/school-years',
  SchoolYearsValidator.insert,
  SchoolYearsController.store
);
routes.put(
  '/school-years/:id',
  SchoolYearsValidator.update,
  SchoolYearsController.update
);
routes.delete(
  '/school-years/:id',
  SchoolYearsValidator.delete,
  SchoolYearsController.delete
);

// Charges
routes.get('/charges', ChargesController.index);
routes.post('/charges', ChargesValidator.insert, ChargesController.store);
routes.put('/charges/:id', ChargesValidator.update, ChargesController.update);
routes.delete(
  '/charges/:id',
  ChargesValidator.delete,
  ChargesController.delete
);

// General Classes
routes.get('/general-classes', GeneralClassesController.index);
routes.post(
  '/general-classes',
  GeneralClassesValidator.insert,
  GeneralClassesController.store
);
routes.put(
  '/general-classes/:id',
  GeneralClassesValidator.update,
  GeneralClassesController.update
);
routes.delete(
  '/general-classes/:id',
  GeneralClassesValidator.delete,
  GeneralClassesController.delete
);

// Requisition States
routes.get('/requisition-states', RequisitionStatesController.index);
routes.post(
  '/requisition-states',
  RequisitionStatesValidator.insert,
  RequisitionStatesController.store
);
routes.put(
  '/requisition-states/:id',
  RequisitionStatesValidator.update,
  RequisitionStatesController.update
);
routes.delete(
  '/requisition-states/:id',
  RequisitionStatesValidator.delete,
  RequisitionStatesController.delete
);

// School Subjects
routes.get('/school-subjects', SchoolSubjectsController.index);
routes.post(
  '/school-subjects',
  SchoolSubjectsValidator.insert,
  SchoolSubjectsController.store
);
routes.put(
  '/school-subjects/:id',
  SchoolSubjectsValidator.update,
  SchoolSubjectsController.update
);
routes.delete(
  '/school-subjects/:id',
  SchoolSubjectsValidator.delete,
  SchoolSubjectsController.delete
);

// Books
routes.get('/books', BooksController.index);
routes.post(
  '/books',
  multer(multerImagesConfig).single('cover'),
  BooksValidator.insert,
  BooksController.store
);
routes.put(
  '/books/:isbn',
  multer(multerImagesConfig).single('cover'),
  BooksValidator.update,
  BooksController.update
);
routes.delete('/books/:isbn', BooksValidator.delete, BooksController.delete);

// Users
routes.get('/users', UsersController.index);
routes.post(
  '/users',
  multer(multerImagesConfig).single('photo'),
  UsersValidator.insert,
  UsersController.store
);
routes.put(
  '/users/:id',
  multer(multerImagesConfig).single('photo'),
  UsersValidator.update,
  UsersController.update
);
routes.delete('/users/:id', UsersValidator.delete, UsersController.delete);

// Guardians
routes.get('/guardians', GuardiansController.index);
routes.post('/guardians', GuardiansValidator.insert, GuardiansController.store);
routes.put(
  '/guardians/:id',
  GuardiansValidator.update,
  GuardiansController.update
);
routes.delete(
  '/guardians/:id',
  GuardiansValidator.delete,
  GuardiansController.delete
);

// Teachers
routes.get('/teachers', TeachersController.index);
routes.post('/teachers', TeachersValidator.insert, TeachersController.store);
routes.put(
  '/teachers/:id',
  TeachersValidator.update,
  TeachersController.update
);
routes.delete(
  '/teachers/:id',
  TeachersValidator.delete,
  TeachersController.delete
);

// Students
routes.get('/students', StudentsController.index);
routes.post('/students', StudentsValidator.insert, StudentsController.store);
routes.put(
  '/students/:id',
  StudentsValidator.update,
  StudentsController.update
);
routes.delete(
  '/students/:id',
  StudentsValidator.delete,
  StudentsController.delete
);

// Classes
routes.get('/classes', ClassesController.index);
routes.post('/classes', ClassesValidator.insert, ClassesController.store);
routes.put('/classes/:id', ClassesValidator.update, ClassesController.update);
routes.delete(
  '/classes/:id',
  ClassesValidator.delete,
  ClassesController.delete
);

module.exports = routes;
