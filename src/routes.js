const express = require('express');
const { check, validationResult, matchedData } = require('express-validator');
const email = require('./email');
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();
router.get('/', (req, res) => {
  res.render('index');
});

router.get('/contact', (req, res) => {
  res.render('contact', {
    errors: {},
    data: {},
    csrfToken: req.csrfToken
  });
});

router.post('/contact', upload.single('photo'), csrfProtection, [
  check('message')
    .isLength({ min: 1 })
    .withMessage('Message is required')
    .trim(),
  check('email')
    .isEmail()
    .withMessage('That email doesn‘t look right')
    .bail()
    .trim()
    .normalizeEmail()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('contact', {
      data: req.body,
      errors: errors.mapped(),
      csrfToken: req.csrfToken
    });
  }

  const data = matchedData(req);
  console.log('Sanitized:', data);
  // Homework: send sanitized data in an email or persist to a db:
  email.send(data.email, 'message-from-node', data.message);

  if (req.file) {
    console.log('Uploaded: ', req.file);
    // Homework: Upload file to S3
  }

  req.flash('success', 'Thanks for the message! I‘ll be in touch :)');
  res.redirect('/');
});

module.exports = router;
