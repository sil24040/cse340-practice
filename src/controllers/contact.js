import { body, validationResult } from 'express-validator';
import { insertContact } from '../models/contact.js';

export const contactValidationRules = [
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

export function showContactForm(req, res) {
  res.render('contact/form', {
    title: 'Contact Us',
    errors: [],
    old: { subject: '', message: '' }
  });
}

export async function processContactForm(req, res, next) {
  try {
    const errors = validationResult(req);
    const { subject, message } = req.body;

    if (!errors.isEmpty()) {
      return res.status(400).render('contact/form', {
        title: 'Contact Us',
        errors: errors.array(),
        old: { subject, message }
      });
    }

    await insertContact(subject, message);

    res.render('contact/success', {
      title: 'Message Sent'
    });
  } catch (error) {
    next(error);
  }
}
