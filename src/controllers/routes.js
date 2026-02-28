import { Router } from 'express';

// Basic pages
import { homePage } from './home.js';
import { aboutPage } from './about.js';

// Catalog
import { catalogPage, courseDetailPage } from './catalog/catalog.js';

// Faculty
import { facultyListPage, facultyDetailPage } from './faculty/faculty.js';

// Contact (form controller)
import {
  showContactForm,
  processContactForm,
  contactValidationRules
} from './contact.js';

// Registration
import {
  showRegistrationForm,
  processRegistration,
  registrationValidationRules
} from './auth/registration.js';

// Login
import {
  showLoginForm,
  processLogin,
  loginValidationRules,
  logout
} from './auth/login.js';

const router = Router();

/* -----------------------------------------
   Router-Level CSS Injection
------------------------------------------ */

router.use('/catalog', (req, res, next) => {
  res.addStyle('<link rel="stylesheet" href="/css/catalog.css">');
  next();
});

router.use('/faculty', (req, res, next) => {
  res.addStyle('<link rel="stylesheet" href="/css/faculty.css">');
  next();
});

router.use('/contact', (req, res, next) => {
  res.addStyle('<link rel="stylesheet" href="/css/contact.css">');
  next();
});

router.use('/register', (req, res, next) => {
  res.addStyle('<link rel="stylesheet" href="/css/register.css">');
  next();
});

router.use('/login', (req, res, next) => {
  res.addStyle('<link rel="stylesheet" href="/css/login.css">');
  next();
});

/* -----------------------------------------
   Core Pages
------------------------------------------ */

router.get('/', homePage);
router.get('/about', aboutPage);

/* -----------------------------------------
   Catalog
------------------------------------------ */

router.get('/catalog', catalogPage);
router.get('/catalog/:slugId', courseDetailPage);

/* -----------------------------------------
   Faculty
------------------------------------------ */

router.get('/faculty', facultyListPage);
router.get('/faculty/:slugId', facultyDetailPage);

/* -----------------------------------------
   Contact Form
------------------------------------------ */

router.get('/contact', showContactForm);
router.post('/contact', contactValidationRules, processContactForm);

/* -----------------------------------------
   Registration
------------------------------------------ */

router.get('/register', showRegistrationForm);
router.post('/register', registrationValidationRules, processRegistration);

/* -----------------------------------------
   Login / Logout
------------------------------------------ */

router.get('/login', showLoginForm);
router.post('/login', loginValidationRules, processLogin);
router.get('/logout', logout);

export default router;
