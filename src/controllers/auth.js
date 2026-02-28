import bcrypt from 'bcrypt';
import { body, validationResult } from 'express-validator';
import { createUser, findUserByEmail } from '../models/users.js';

export const registrationValidationRules = [
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Valid email is required')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),
  body('confirmPassword')
    .custom((value, { req }) => value === req.body.password)
    .withMessage('Passwords must match')
];

export const loginValidationRules = [
  body('email').trim().isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
];

export function showRegistrationForm(req, res) {
  res.render('auth/register', {
    title: 'Register',
    errors: [],
    old: { firstName: '', lastName: '', email: '' }
  });
}

export async function processRegistration(req, res, next) {
  try {
    const errors = validationResult(req);
    const { firstName, lastName, email, password } = req.body;

    if (!errors.isEmpty()) {
      return res.status(400).render('auth/register', {
        title: 'Register',
        errors: errors.array(),
        old: { firstName, lastName, email }
      });
    }

    const existing = await findUserByEmail(email);
    if (existing) {
      return res.status(400).render('auth/register', {
        title: 'Register',
        errors: [{ msg: 'Email is already registered' }],
        old: { firstName, lastName, email }
      });
    }

    const hash = await bcrypt.hash(password, 10);
    const user = await createUser(firstName, lastName, email, hash);

    req.session.user = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email
    };

    res.redirect('/');
  } catch (error) {
    next(error);
  }
}

export function showLoginForm(req, res) {
  res.render('auth/login', {
    title: 'Login',
    errors: [],
    old: { email: '' }
  });
}

export async function processLogin(req, res, next) {
  try {
    const errors = validationResult(req);
    const { email, password } = req.body;

    if (!errors.isEmpty()) {
      return res.status(400).render('auth/login', {
        title: 'Login',
        errors: errors.array(),
        old: { email }
      });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(400).render('auth/login', {
        title: 'Login',
        errors: [{ msg: 'Invalid email or password' }],
        old: { email }
      });
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(400).render('auth/login', {
        title: 'Login',
        errors: [{ msg: 'Invalid email or password' }],
        old: { email }
      });
    }

    req.session.user = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email
    };

    res.redirect('/');
  } catch (error) {
    next(error);
  }
}

export function logout(req, res) {
  req.session.destroy(() => {
    res.redirect('/');
  });
}
