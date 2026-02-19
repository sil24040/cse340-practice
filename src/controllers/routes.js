import { Router } from 'express';

import { addDemoHeaders } from '../middleware/demo/headers.js';
import { catalogPage, courseDetailPage } from './catalog/catalog.js';
import { facultyListPage, facultyDetailPage } from './faculty/faculty.js';

import contactRoutes from './forms/contact.js';
import registrationRoutes from './forms/registration.js'; // ✅ ADD THIS

const router = Router();

/**
 * Router-level middleware for dynamic assets
 * Must be BEFORE route definitions.
 */
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

// ✅ ADD THIS middleware (Registration CSS)
router.use('/register', (req, res, next) => {
  res.addStyle('<link rel="stylesheet" href="/css/registration.css">');
  next();
});

// ROUTES
router.get('/', (req, res) => {
  res.render('home', { title: 'Welcome Home' });
});

router.get('/about', (req, res) => {
  res.render('about', { title: 'About Me' });
});

router.get('/products', (req, res) => {
  res.render('products', { title: 'Our Products' });
});

router.get('/student', (req, res) => {
  res.render('student', {
    title: 'Student',
    student: {
      name: 'Sophie Silveira',
      id: '783969347',
      email: 'sophiesilveira9@gmail.com',
      address: 'Rexburg, ID, USA'
    }
  });
});

router.get('/catalog', catalogPage);
router.get('/catalog/:slugId', courseDetailPage);

router.get('/faculty', facultyListPage);
router.get('/faculty/:slugId', facultyDetailPage);

// ✅ Mount feature routes
router.use('/contact', contactRoutes);
router.use('/register', registrationRoutes); // ✅ ADD THIS

router.get('/demo', addDemoHeaders, (req, res) => {
  res.render('demo', { title: 'Middleware Demo Page' });
});

router.get('/test-error', (req, res, next) => {
  const err = new Error('This is a test error');
  err.status = 500;
  next(err);
});

export default router;