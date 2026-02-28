import { Router } from 'express';

import { homePage } from './home.js';
import { aboutPage } from './about.js';

import { catalogPage, courseDetailPage } from './catalog/catalog.js';
import { facultyListPage, facultyDetailPage } from './faculty/faculty.js';

import {
  showContactForm,
  processContactForm,
  contactValidationRules
} from './contact.js';

import {
  showRegistrationForm,
  processRegistration,
  registrationValidationRules,
  showLoginForm,
  processLogin,
  loginValidationRules,
  logout
} from './auth.js';

const router = Router();

// Section-specific CSS via router-level middleware
router.use('/catalog', (req, res, next) => {
  res.addStyle('<link rel="stylesheet" href="/css/catalog.css">', 10);
  next();
});

router.use('/faculty', (req, res, next) => {
  res.addStyle('<link rel="stylesheet" href="/css/faculty.css">', 10);
  next();
});

router.use('/contact', (req, res, next) => {
  res.addStyle('<link rel="stylesheet" href="/css/contact.css">', 10);
  next();
});

router.use('/register', (req, res, next) => {
  res.addStyle('<link rel="stylesheet" href="/css/register.css">', 10);
  next();
});

router.use('/login', (req, res, next) => {
  res.addStyle('<link rel="stylesheet" href="/css/login.css">', 10);
  next();
});

// Core routes
router.get('/', homePage);
router.get('/about', aboutPage);

router.get('/catalog', catalogPage);
router.get('/catalog/:slugId', courseDetailPage);

router.get('/faculty', facultyListPage);
router.get('/faculty/:slugId', facultyDetailPage);

router.get('/contact', showContactForm);
router.post('/contact', contactValidationRules, processContactForm);

router.get('/register', showRegistrationForm);
router.post('/register', registrationValidationRules, processRegistration);

router.get('/login', showLoginForm);
router.post('/login', loginValidationRules, processLogin);

router.get('/logout', logout);

export default router;
