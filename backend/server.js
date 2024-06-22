
require('dotenv').config({ path: '../.env' });
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const complaintRoutes = require('./routes/complaintRoutes');
const chatRoutes = require('./routes/chatRoutes');
const voteRoutes = require('./routes/voteRoutes');
const axios = require('axios');
const path = require('path');

const app = express();

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// console.log(process.env.SESSION_SECRET);

app.use(bodyParser.json());


app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/votes', voteRoutes);
app.use('/api', chatRoutes); 


const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
