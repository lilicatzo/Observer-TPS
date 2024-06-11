const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cors());

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Existing data route
app.get("/data", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM users");
    res.send(rows);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Server error");
  }
});

// Registration endpoint
app.post("/signup", async (req, res) => {
  const { email, password, first_name, last_name, username } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if the email or username already exists
    const existingUser = await pool.query('SELECT * FROM "users" WHERE email = $1 OR username = $2', [email, username]);
    if (existingUser.rows.length > 0) {
      return res.status(409).send("User already exists with this email or username");
    }

    // Insert the new user into the database
    const newUser = await pool.query('INSERT INTO "users" (email, password, first_name, last_name, username) VALUES ($1, $2, $3, $4, $5) RETURNING *', [email, hashedPassword, first_name, last_name, username]);
    res.status(201).json(newUser.rows[0]);
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).send("Server error during registration");
  }
});

// Login endpoint
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const { rows } = await pool.query('SELECT * FROM "users" WHERE username = $1', [username]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "This account does not exist. Please register a new account." });
    }

    const isValid = await bcrypt.compare(password, rows[0].password);
    if (isValid) {
      res.json({ message: "Login successful", userId: rows[0].id }); // Send userId in response
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Server error during login" });
  }
});

// Vote submission endpoint
app.post("/vote", async (req, res) => {
  const { user_id, paslon, reason, anonymous } = req.body;

  try {
    // Check if user has already voted
    const userResult = await pool.query("SELECT is_voted FROM users WHERE id = $1", [user_id]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "User does not exist" });
    }
    if (userResult.rows[0].is_voted) {
      return res.status(400).json({ error: "User has already voted" });
    }

    // Insert vote
    const voteQuery = `
      INSERT INTO votes (user_id, paslon, reason, anonymous, timestamp)
      VALUES ($1, $2, $3, $4, NOW())
      RETURNING *;
    `;
    const voteValues = [user_id, paslon, reason, anonymous];
    const voteResult = await pool.query(voteQuery, voteValues);

    // Update user's is_voted status
    await pool.query("UPDATE users SET is_voted = TRUE WHERE id = $1", [user_id]);

    res.json(voteResult.rows[0]);
  } catch (error) {
    console.error("Error submitting vote:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Fetch vote status endpoint
app.get("/vote-status/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const userResult = await pool.query("SELECT is_voted FROM users WHERE id = $1", [userId]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "User does not exist" });
    }
    res.json({ is_voted: userResult.rows[0].is_voted });
  } catch (error) {
    console.error("Error fetching vote status:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/votes", async (req, res) => {
  try {
    const query = `
      SELECT votes.*, users.username
      FROM votes
      JOIN users ON votes.user_id = users.id;
    `;
    const result = await pool.query(query);

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching votes:", error);
    res.status(500).send("Internal Server Error");
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
