const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/signup', [
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  body('first_name').notEmpty(),
  body('last_name').notEmpty(),
  body('username').notEmpty()
], authController.signUp);


router.post('/login', authController.login);

module.exports = router;
