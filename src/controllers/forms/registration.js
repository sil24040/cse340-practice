import bcrypt from 'bcrypt';
import { body, validationResult } from 'express-validator';
import { createUser, findUserByEmail } from '../../models/users.js';

/**
 * Validation rules for registration
 */
export const registrationValidationRules = [
  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('First name is required'),

  body('lastName')
    .trim()
    .notEmpty()
    .withMessage('Last name is required'),

  body('email')
    .trim()
    .isEmail()
    .withMessage('A valid email is required')
    .normalizeEmail(),

  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),

  body('confirmPassword')
    .custom((value, { req }) => value === req.body.password)
    .withMessage('Passwords must match')
];

/**
 * Show the registration form
 */
export function showRegistrationForm(req, res) {
  res.render('auth/register', {
    title: 'Register',
    errors: [],
    old: { firstName: '', lastName: '', email: '' }
  });
}

/**
 * Handle registration submission
 */
export async function processRegistration(req, res, next) {
  try {
    const errors = validationResult(req);
    const { firstName, lastName, email, password } = req.body;

    // If validation fails, re-render form with errors + sticky values
    if (!errors.isEmpty()) {
      return res.status(400).render('auth/register', {
        title: 'Register',
        errors: errors.array(),
        old: { firstName, lastName, email }
      });
    }

    // Check if email already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).render('auth/register', {
        title: 'Register',
        errors: [{ msg: 'Email is already registered' }],
        old: { firstName, lastName, email }
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user in DB
    const newUser = await createUser(firstName, lastName, email, hashedPassword);

    // Log user in automatically
    req.session.user = {
      id: newUser.id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email
    };

    // Redirect to home page
    res.redirect('/');
  } catch (error) {
    next(error);
  }
}
