import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { createContactForm, getAllContactForms } from '../../models/forms/contact.js';

const router = Router();

const showContactForm = (req, res) => {
  res.render('forms/contact/form', { title: 'Contact Us' });
};

const handleContactSubmission = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.error('Validation errors:', errors.array());
    return res.redirect('/contact');
  }

  const { subject, message } = req.body;

  try {
    await createContactForm(subject, message);
    return res.redirect('/contact/responses');
  } catch (err) {
    console.error('Error saving contact form:', err);
    return res.redirect('/contact');
  }
};

const showContactResponses = async (req, res) => {
  let contactForms = [];
  try {
    contactForms = await getAllContactForms();
  } catch (err) {
    console.error('Error retrieving contact forms:', err);
  }

  res.render('forms/contact/responses', {
    title: 'Contact Form Submissions',
    contactForms
  });
};

router.get('/', showContactForm);

router.post(
  '/',
  [
    body('subject').trim().isLength({ min: 2 }).withMessage('Subject must be at least 2 characters'),
    body('message').trim().isLength({ min: 10 }).withMessage('Message must be at least 10 characters')
  ],
  handleContactSubmission
);

router.get('/responses', showContactResponses);

export default router;