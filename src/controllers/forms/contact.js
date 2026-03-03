import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { insertContact } from '../../models/contact.js';

const router = Router();

// Validation rules
const contactValidationRules = [
  body('subject')
    .trim()
    .notEmpty()
    .withMessage('Subject is required')
    .isLength({ max: 255 })
    .withMessage('Subject must be 255 characters or less'),
  body('message')
    .trim()
    .notEmpty()
    .withMessage('Message is required')
];

// Show form
router.get('/', (req, res) => {
  res.render('forms/contact/form', {
    title: 'Contact Us',
    errors: [],
    old: { subject: '', message: '' }
  });
});

// Process form
router.post('/', contactValidationRules, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    const { subject, message } = req.body;

    if (!errors.isEmpty()) {
      return res.status(400).render('forms/contact/form', {
        title: 'Contact Us',
        errors: errors.array(),
        old: { subject, message }
      });
    }

    await insertContact(subject, message);

    res.render('forms/contact/success', {
      title: 'Message Sent'
    });
  } catch (error) {
    next(error);
  }
});

export default router;
