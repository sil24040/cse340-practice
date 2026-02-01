import { facultyListPage, facultyDetailPage } from './faculty/faculty.js';

import { Router } from 'express';

import { addDemoHeaders } from '../middleware/demo/headers.js';
import { catalogPage, courseDetailPage } from './catalog/catalog.js';

const router = Router();

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
router.get('/catalog/:courseId', courseDetailPage);

router.get('/faculty', facultyListPage);
router.get('/faculty/:facultyId', facultyDetailPage);


router.get('/demo', addDemoHeaders, (req, res) => {
  res.render('demo', { title: 'Middleware Demo Page' });
});

router.get('/test-error', (req, res, next) => {
  const err = new Error('This is a test error');
  err.status = 500;
  next(err);
});

export default router;
