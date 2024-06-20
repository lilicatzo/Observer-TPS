require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
const axios = require("axios");
const { Groq } = require("groq-sdk");

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

app.get("/data", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM users");
    res.send(rows);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Server error");
  }
});

app.post("/signup", async (req, res) => {
  const { email, password, first_name, last_name, username } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await pool.query('SELECT * FROM "users" WHERE email = $1 OR username = $2', [email, username]);
    if (existingUser.rows.length > 0) {
      return res.status(409).send("User already exists with this email or username");
    }

    const newUser = await pool.query('INSERT INTO "users" (email, password, first_name, last_name, username) VALUES ($1, $2, $3, $4, $5) RETURNING *', [email, hashedPassword, first_name, last_name, username]);
    res.status(201).json(newUser.rows[0]);
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).send("Server error during registration");
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const { rows } = await pool.query('SELECT * FROM "users" WHERE username = $1', [username]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "This account does not exist. Please register a new account." });
    }

    const isValid = await bcrypt.compare(password, rows[0].password);
    if (isValid) {
      res.json({ message: "Login successful", userId: rows[0].id });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Server error during login" });
  }
});

app.post("/vote", async (req, res) => {
  const { user_id, paslon, reason, anonymous } = req.body;

  try {
    const userResult = await pool.query("SELECT is_voted FROM users WHERE id = $1", [user_id]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "User does not exist" });
    }
    if (userResult.rows[0].is_voted) {
      return res.status(400).json({ error: "User has already voted" });
    }

    const voteQuery = `
      INSERT INTO votes (user_id, paslon, reason, anonymous, timestamp)
      VALUES ($1, $2, $3, $4, NOW())
      RETURNING *;
    `;
    const voteValues = [user_id, paslon, reason, anonymous];
    const voteResult = await pool.query(voteQuery, voteValues);

    await pool.query("UPDATE users SET is_voted = TRUE WHERE id = $1", [user_id]);

    res.json(voteResult.rows[0]);
  } catch (error) {
    console.error("Error submitting vote:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

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

app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    const response = await requestToGroqAI(message);
    res.json({ reply: response });
  } catch (error) {
    console.error("Error during chat interaction:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const requestToGroqAI = async (content) => {
  const GROQ_API = "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";
  const groq = new Groq({
    apiKey: GROQ_API,
    dangerouslyAllowBrowser: true,
  });

  const reply = await groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content,
      },
    ],
    model: "gemma-7b-it",
    temperature: 0.2,
    top_p: 0.2,
  });

  const formattedResponse = formatBulletPoints(reply.choices[0].message.content);
  return formattedResponse;
};

const formatBulletPoints = (text) => {
  const lines = text.split("\n");
  return lines
    .map((line, index) => {
      if (line.match(/^1\.\s+\*\*/) || line.match(/^2\.\s+\*\*/) || line.match(/^3\.\s+\*\*/)) {
        // Handle bold text in list items
        return `<div key=${index}><strong>${line}</strong></div>`;
      } else if (line.startsWith("* ")) {
        // Handle bullet points
        return `<li key=${index}>${line.substring(2)}</li>`;
      } else if (line.startsWith("**")) {
        // Handle bold text
        return `<div key=${index}><strong>${line.substring(2, line.length - 2)}</strong></div>`;
      } else {
        return `<div key=${index}>${line}</div>`;
      }
    })
    .join("");
};

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
