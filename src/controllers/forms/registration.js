import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import { emailExists, saveUser, getAllUsers } from '../../models/forms/registration.js';

const router = Router();

/**
 * Validation rules
 */
const registrationValidation = [
  body('name')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters'),

  body('email')
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage('Must be a valid email address'),

  body('emailConfirm')
    .trim()
    .custom((value, { req }) => value === req.body.email)
    .withMessage('Email addresses must match'),

  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/[0-9]/)
    .withMessage('Password must contain at least one number')
    .matches(/[!@#$%^&*]/)
    .withMessage('Password must contain at least one special character'),

  body('passwordConfirm')
    .custom((value, { req }) => value === req.body.password)
    .withMessage('Passwords must match')
];

/**
 * GET /register
 */
const showRegistrationForm = (req, res) => {
  res.render('forms/registration/form', { title: 'User Registration' });
};

/**
 * POST /register
 */
const processRegistration = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.error('Validation errors:', errors.array());
    return res.redirect('/register');
  }

  const { name, email, password } = req.body;

  try {
    const exists = await emailExists(email);

    if (exists) {
      console.log('Email already registered');
      return res.redirect('/register');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await saveUser(name, email, hashedPassword);

    console.log('User registered successfully');
    return res.redirect('/register/list');
  } catch (error) {
    console.error('Registration error:', error);
    return res.redirect('/register');
  }
};

/**
 * GET /register/list
 */
const showAllUsers = async (req, res) => {
  let users = [];

  try {
    users = await getAllUsers();
  } catch (error) {
    console.error('Error fetching users:', error);
  }

  res.render('forms/registration/list', {
    title: 'Registered Users',
    users
  });
};

router.get('/', showRegistrationForm);
router.post('/', registrationValidation, processRegistration);
router.get('/list', showAllUsers);

export default router;