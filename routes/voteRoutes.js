const express = require('express');
const router = express.Router();
const db = require('../config/database');

router.post('/vote', (req, res) => {
  const { type, candidateId } = req.body;
  const table = `votes_${type}`;
  
  const query = `INSERT INTO ${table} (candidate_id) VALUES (?)`;
  db.query(query, [candidateId], (err, result) => {
    if (err) {
      res.status(500).json({ error: 'Error recording vote' });
      return;
    }
    res.json({ success: true, message: 'Vote recorded successfully' });
  });
});

router.get('/results', (req, res) => {
  const query = `
    SELECT 
      'osis' as type, candidate_id, COUNT(*) as count 
    FROM votes_osis 
    GROUP BY candidate_id
    UNION ALL
    SELECT 
      'mpk' as type, candidate_id, COUNT(*) as count 
    FROM votes_mpk 
    GROUP BY candidate_id
  `;
  
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Error fetching results' });
      return;
    }
    res.json(results);
  });
});

module.exports = router;