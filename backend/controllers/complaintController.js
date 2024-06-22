const path = require('path');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const pool = require('../database');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve(__dirname, '../uploads/'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${uuidv4()}`;
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

const isLoggedIn = (req, res, next) => {
  const userId = req.headers['authorization'] ? req.headers['authorization'].split(' ')[1] : null;
  if (!userId) {
    return res.status(401).send('You must be logged in to submit a complaint.');
  }
  req.userId = userId;
  next();
};

// const submitComplaint = async (req, res) => {
//   const { complaint_text } = req.body;
//   const media_url = req.file ? req.file.path : null;
//   const user_id = req.userId;

//   try {
//     const query = 'INSERT INTO complaints (user_id, complaint_text, media_url) VALUES ($1, $2, $3) RETURNING *';
//     const values = [user_id, complaint_text, media_url];
//     const result = await pool.query(query, values);
//     res.status(201).send(result.rows[0]);
//   } catch (error) {
//     console.error('Error submitting complaint:', error);
//     res.status(500).send('Server error');
//   }
// };

const submitComplaint = async (req, res) => {
  const { complaint_text } = req.body;
  const media_url = req.file ? `/uploads/${req.file.filename}` : null;  // Store relative path
  const user_id = req.userId;

  try {
    const query = 'INSERT INTO complaints (user_id, complaint_text, media_url) VALUES ($1, $2, $3) RETURNING *';
    const values = [user_id, complaint_text, media_url];
    const result = await pool.query(query, values);
    res.status(201).send(result.rows[0]);
  } catch (error) {
    console.error('Error submitting complaint:', error);
    res.status(500).send('Server error');
  }
};



const seeComplaints = async (req, res) => {
  if (!req.session.user || !req.session.user.isAdmin) {
    return res.status(403).send('Forbidden');
  }

  try {
    const { rows } = await pool.query('SELECT * FROM complaints');
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching complaints:', error);
    res.status(500).send('Server error');
  }
};

module.exports = {
  upload,
  isLoggedIn,
  submitComplaint,
  seeComplaints
};
