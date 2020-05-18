const express = require('express');

// const HandbookController = require('./controllers/HandbookController');
const SchoolYearsController = require('./controllers/SchoolYearsController');
const ChargesController = require('./controllers/ChargesController');
const GeneralClassesController = require('./controllers/GeneralClassesController');
const RequisitionStatesController = require('./controllers/RequisitionStatesController');
const SchoolSubjectsController = require('./controllers/SchoolSubjectsController');
const BooksController = require('./controllers/BooksController');
const UsersController = require('./controllers/UsersController');
const GuardiansController = require('./controllers/GuardiansController');
const TeachersController = require('./controllers/TeachersController');
const StudentsController = require('./controllers/StudentsController');
const ClassesController = require('./controllers/ClassesController');

const SchoolYearsValidator = require('./validators/SchoolYearsValidator');
const ChargesValidator = require('./validators/ChargesValidator');
const GeneralClassesValidator = require('./validators/GeneralClassesValidator');
const RequisitionStatesValidator = require('./validators/RequisitionStatesValidator');
const SchoolSubjectsValidator = require('./validators/SchoolSubjectsValidator');
const BooksValidator = require('./validators/BooksValidator');
const UsersValidator = require('./validators/UsersValidator');

const routes = express.Router();

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
routes.post('/books', BooksValidator.insert, BooksController.store);
routes.put('/books/:id', BooksValidator.update, BooksController.update);
routes.delete('/books/:id', BooksValidator.delete, BooksController.delete);

// Users
routes.get('/users', UsersController.index);
routes.post('/users', UsersValidator.insert, UsersController.store);
routes.put('/users/:id', UsersValidator.update, UsersController.update);
routes.delete('/users/:id', UsersValidator.delete, UsersController.delete);

// Guardians - VALIDATORS
routes.get('/guardians', GuardiansController.index);
routes.post('/guardians', GuardiansController.store);
routes.put('/guardians/:id', GuardiansController.update);
routes.delete('/guardians/:id', GuardiansController.delete);

// Teachers - VALIDATORS
routes.get('/teachers', TeachersController.index);
routes.post('/teachers', TeachersController.store);
routes.put('/teachers/:id', TeachersController.update);
routes.delete('/teachers/:id', TeachersController.delete);

// Students - VALIDATORS
routes.get('/students', StudentsController.index);
routes.post('/students', StudentsController.store);
routes.put('/students/:id', StudentsController.update);
routes.delete('/students/:id', StudentsController.delete);

// Classes - VALIDATORS
routes.get('/classes', ClassesController.index);
routes.post('/classes', ClassesController.store);
routes.put('/classes/:id', ClassesController.update);
routes.delete('/classes/:id', ClassesController.delete);

module.exports = routes;
