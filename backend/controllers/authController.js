const bcrypt = require('bcrypt');
const pool = require('../database');
const { validationResult } = require('express-validator');

const signUp = async (req, res) => {
  const { email, password, first_name, last_name, username } = req.body;
  
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const existingUser = await pool.query('SELECT * FROM "users" WHERE email = $1 OR username = $2', [email, username]);
    if (existingUser.rows.length > 0) {
      return res.status(409).json({ error: 'User already exists with this email or username' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await pool.query('INSERT INTO "users" (email, password, first_name, last_name, username) VALUES ($1, $2, $3, $4, $5) RETURNING *', [email, hashedPassword, first_name, last_name, username]);
    res.status(201).json(newUser.rows[0]);
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ error: 'Server error during registration' });
  }
};


const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    console.log('Login request received for username:', username);

    const { rows } = await pool.query('SELECT * FROM "users" WHERE username = $1', [username]);
    console.log('User query result:', rows);

    if (rows.length === 0) {
      return res.status(404).send('This account does not exist. Please register a new account.');
    }

    const isValid = await bcrypt.compare(password, rows[0].password);
    console.log('Password validation result:', isValid);

    if (isValid) {
      req.session.user = { id: rows[0].id, isAdmin: rows[0].is_admin };
      console.log('Session data after login:', req.session.user);
      res.status(200).json({ userId: rows[0].id, isAdmin: rows[0].is_admin });
    } else {
      res.status(401).send('Invalid credentials');
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).send('Server error during login');
  }
};

module.exports = {
  signUp,
  login
};
