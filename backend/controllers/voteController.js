const pool = require('../database');

const submitVote = async (req, res) => {
  const { user_id, paslon, reason, anonymous } = req.body;
  try {
    const userResult = await pool.query('SELECT is_voted FROM users WHERE id = $1', [user_id]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User does not exist' });
    }
    if (userResult.rows[0].is_voted) {
      return res.status(400).json({ error: 'User has already voted' });
    }

    const voteQuery = `
      INSERT INTO votes (user_id, paslon, reason, anonymous, timestamp)
      VALUES ($1, $2, $3, $4, NOW())
      RETURNING *;
    `;
    const voteValues = [user_id, paslon, reason, anonymous];
    const voteResult = await pool.query(voteQuery, voteValues);

    await pool.query('UPDATE users SET is_voted = TRUE WHERE id = $1', [user_id]);

    res.json(voteResult.rows[0]);
  } catch (error) {
    console.error('Error submitting vote:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getVoteStatus = async (req, res) => {
  const { userId } = req.params;
  try {
    const userResult = await pool.query('SELECT is_voted FROM users WHERE id = $1', [userId]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User does not exist' });
    }
    res.json({ is_voted: userResult.rows[0].is_voted });
  } catch (error) {
    console.error('Error fetching vote status:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getVotes = async (req, res) => {
  try {
    const query = `
      SELECT votes.*, users.username
      FROM votes
      JOIN users ON votes.user_id = users.id;
    `;
    const result = await pool.query(query);

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching votes:', error);
    res.status(500).send('Internal Server Error');
  }
};

module.exports = {
  submitVote,
  getVoteStatus,
  getVotes
};
