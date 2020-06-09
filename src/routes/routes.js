const express = require('express');
const path = require('path');
const multer = require('multer');

const multerImagesConfig = require('../config/multerImagesConfig');

// const HandbookController = require('./controllers/HandbookController');
const SchoolYearsController = require('../controllers/SchoolYearsController');
const GeneralClassesController = require('../controllers/GeneralClassesController');
const RequisitionStatesController = require('../controllers/RequisitionStatesController');
const SchoolSubjectsController = require('../controllers/SchoolSubjectsController');
const BooksController = require('../controllers/BooksController');
const UsersController = require('../controllers/UsersController');
const GuardiansController = require('../controllers/GuardiansController');
const TeachersController = require('../controllers/TeachersController');
const StudentsController = require('../controllers/StudentsController');
const ClassesController = require('../controllers/ClassesController');
const BookLocationsController = require('../controllers/BookLocationsController');
const BookStatesController = require('../controllers/BookStatesController');
const PhysicalBooksController = require('../controllers/PhysicalBooksController');
const ResumesController = require('../controllers/ResumesController');
const AdoptedBooksController = require('../controllers/AdoptedBooksController');
const SchoolEnrollmentsController = require('../controllers/SchoolEnrollmentsController');
const RequisitionsController = require('../controllers/RequisitionsController');
const BookRequisitionsController = require('../controllers/BookRequisitionsController');
const RequisitionsPhysicalBookController = require('../controllers/RequisitionsPhysicalBookController');
const DeliveriesController = require('../controllers/DeliveriesController');
const ReturnsController = require('../controllers/ReturnsController');
const AccountsController = require('../controllers/AccountsController');
const ConfigsController = require('../controllers/ConfigsController');
const ResumesAdoptedBooksController = require('../controllers/ResumesAdoptedBooksController');

const SchoolYearsValidator = require('../validators/SchoolYearsValidator');
const GeneralClassesValidator = require('../validators/GeneralClassesValidator');
const RequisitionStatesValidator = require('../validators/RequisitionStatesValidator');
const SchoolSubjectsValidator = require('../validators/SchoolSubjectsValidator');
const BooksValidator = require('../validators/BooksValidator');
const UsersValidator = require('../validators/UsersValidator');
const GuardiansValidator = require('../validators/GuardiansValidator');
const TeachersValidator = require('../validators/TeachersValidator');
const StudentsValidator = require('../validators/StudentsValidator');
const ClassesValidator = require('../validators/ClassesValidator');
const BookLocationsValidator = require('../validators/BookLocationsValidator');
const BookStatesValidator = require('../validators/BookStatesValidator');
const PhysicalBooksValidator = require('../validators/PhysicalBooksValidator');
const ResumesValidator = require('../validators/ResumesValidator');
const AdoptedBooksValidator = require('../validators/AdoptedBooksValidator');
const SchoolEnrollmentsValidator = require('../validators/SchoolEnrollmentsValidator');
const RequisitionsValidator = require('../validators/RequisitionsValidator');
const BookRequisitionsValidator = require('../validators/BookRequisitionsValidator');
const RequisitionsPhysicalBookValidator = require('../validators/RequisitionsPhysicalBookValidator');
const DeliveriesValidator = require('../validators/DeliveriesValidator');
const ReturnsValidator = require('../validators/ReturnsValidator');
const AccountsValidator = require('../validators/AccountsValidator');
const ConfigsValidator = require('../validators/ConfigsValidator');
const ResumesAdoptedBooksValidator = require('../validators/ResumesAdoptedBooksValidator');

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
routes.get('/books', BooksValidator.index, BooksController.index);
routes.get('/books/:isbn', BooksValidator.get, BooksController.get);
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
routes.get('/users', UsersValidator.index, UsersController.index);
routes.get('/users/:id', UsersValidator.get, UsersController.get);
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
routes.get('/guardians', GuardiansValidator.index, GuardiansController.index);
routes.get('/guardians/:id', GuardiansValidator.get, GuardiansController.get);
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
routes.get('/teachers', TeachersValidator.index, TeachersController.index);
routes.get('/teachers/:id', TeachersValidator.get, TeachersController.get);
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
routes.get('/students', StudentsValidator.index, StudentsController.index);
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
routes.get('/classes', ClassesValidator.index, ClassesController.index);
routes.get(
  '/classes/:class_id/:school_year_id',
  ClassesValidator.get,
  ClassesController.get
);
routes.post('/classes', ClassesValidator.insert, ClassesController.store);
routes.put(
  '/classes/:class_id/:school_year_id',
  ClassesValidator.update,
  ClassesController.update
);
routes.delete(
  '/classes/:class_id/:school_year_id',
  ClassesValidator.delete,
  ClassesController.delete
);

// Book Locations
routes.get('/book-locations', BookLocationsController.index);
routes.post(
  '/book-locations',
  BookLocationsValidator.insert,
  BookLocationsController.store
);
routes.put(
  '/book-locations/:id',
  BookLocationsValidator.update,
  BookLocationsController.update
);
routes.delete(
  '/book-locations/:id',
  BookLocationsValidator.delete,
  BookLocationsController.delete
);

// Book States
routes.get('/book-states', BookStatesController.index);
routes.post(
  '/book-states',
  BookStatesValidator.insert,
  BookStatesController.store
);
routes.put(
  '/book-states/:id',
  BookStatesValidator.update,
  BookStatesController.update
);
routes.delete(
  '/book-states/:id',
  BookStatesValidator.delete,
  BookStatesController.delete
);

// Physical Books
routes.get(
  '/physical-books',
  PhysicalBooksValidator.index,
  PhysicalBooksController.index
);
routes.post(
  '/physical-books',
  PhysicalBooksValidator.insert,
  PhysicalBooksController.store
);
routes.put(
  '/physical-books/:id',
  PhysicalBooksValidator.update,
  PhysicalBooksController.update
);
routes.delete(
  '/physical-books/:id',
  PhysicalBooksValidator.delete,
  PhysicalBooksController.delete
);

// Resumes AdoptedBooks
routes.get(
  '/resumes/adopted-books',
  ResumesAdoptedBooksValidator.index,
  ResumesAdoptedBooksController.index
);

// Resumes
routes.get('/resumes', ResumesValidator.index, ResumesController.index);
routes.get('/resumes/:id', ResumesValidator.get, ResumesController.get);
routes.post('/resumes', ResumesValidator.insert, ResumesController.store);
routes.put('/resumes/:id', ResumesValidator.update, ResumesController.update);
routes.delete(
  '/resumes/:id',
  ResumesValidator.delete,
  ResumesController.delete
);

// Adopted Books
routes.get(
  '/adopted-books',
  AdoptedBooksValidator.index,
  AdoptedBooksController.index
);
routes.get(
  '/adopted-books/:id',
  AdoptedBooksValidator.get,
  AdoptedBooksController.get
);
routes.post(
  '/adopted-books',
  AdoptedBooksValidator.insert,
  AdoptedBooksController.store
);
routes.put(
  '/adopted-books/:id',
  AdoptedBooksValidator.update,
  AdoptedBooksController.update
);
routes.delete(
  '/adopted-books/:id',
  AdoptedBooksValidator.delete,
  AdoptedBooksController.delete
);

// School Enrollments
routes.get(
  '/school-enrollments',
  SchoolEnrollmentsValidator.index,
  SchoolEnrollmentsController.index
);
routes.get(
  '/school-enrollments/:id',
  SchoolEnrollmentsValidator.get,
  SchoolEnrollmentsController.get
);
routes.post(
  '/school-enrollments',
  SchoolEnrollmentsValidator.insert,
  SchoolEnrollmentsController.store
);
routes.put(
  '/school-enrollments/:id',
  SchoolEnrollmentsValidator.update,
  SchoolEnrollmentsController.update
);
routes.delete(
  '/school-enrollments/:id',
  SchoolEnrollmentsValidator.delete,
  SchoolEnrollmentsController.delete
);

// Requisitions
routes.get(
  '/requisitions',
  RequisitionsValidator.index,
  RequisitionsController.index
);
routes.get(
  '/requisitions/:id',
  RequisitionsValidator.get,
  RequisitionsController.get
);
routes.post(
  '/requisitions',
  RequisitionsValidator.insert,
  RequisitionsController.store
);
routes.put(
  '/requisitions/:id',
  RequisitionsValidator.update,
  RequisitionsController.update
);
routes.delete(
  '/requisitions/:id',
  RequisitionsValidator.delete,
  RequisitionsController.delete
);

// Book Requisitions
routes.get('/book-requisitions', BookRequisitionsController.index);
routes.post(
  '/book-requisitions',
  BookRequisitionsValidator.insert,
  BookRequisitionsController.store
);
routes.put(
  '/book-requisitions/:id',
  BookRequisitionsValidator.update,
  BookRequisitionsController.update
);
routes.delete(
  '/book-requisitions/:id',
  BookRequisitionsValidator.delete,
  BookRequisitionsController.delete
);

// Book Requisitions
routes.get(
  '/requisitions-physical-book',
  RequisitionsPhysicalBookController.index
);
routes.post(
  '/requisitions-physical-book',
  RequisitionsPhysicalBookValidator.insert,
  RequisitionsPhysicalBookController.store
);
routes.put(
  '/requisitions-physical-book/:id',
  RequisitionsPhysicalBookValidator.update,
  RequisitionsPhysicalBookController.update
);
routes.delete(
  '/requisitions-physical-book/:id',
  RequisitionsPhysicalBookValidator.delete,
  RequisitionsPhysicalBookController.delete
);

// Deliveries
routes.get('/deliveries', DeliveriesController.index);
routes.post(
  '/deliveries',
  DeliveriesValidator.insert,
  DeliveriesController.store
);
routes.put(
  '/deliveries/:id',
  DeliveriesValidator.update,
  DeliveriesController.update
);
routes.delete(
  '/deliveries/:id',
  DeliveriesValidator.delete,
  DeliveriesController.delete
);

// Returns
routes.get('/returns', ReturnsController.index);
routes.post('/returns', ReturnsValidator.insert, ReturnsController.store);
routes.put('/returns/:id', ReturnsValidator.update, ReturnsController.update);
routes.delete(
  '/returns/:id',
  ReturnsValidator.delete,
  ReturnsController.delete
);

// Accounts
routes.get('/accounts', AccountsValidator.index, AccountsController.index);
routes.get('/accounts/:id', AccountsValidator.get, AccountsController.get);
routes.post('/accounts', AccountsValidator.insert, AccountsController.store);
routes.put(
  '/accounts/:id',
  AccountsValidator.update,
  AccountsController.update
);
routes.delete(
  '/accounts/:id',
  AccountsValidator.delete,
  AccountsController.delete
);

// Configs
routes.get('/configs', ConfigsController.index);
routes.put('/configs', ConfigsValidator.update, ConfigsController.update);

module.exports = routes;
