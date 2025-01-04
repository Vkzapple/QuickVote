const express = require('express');
const cors = require('cors');
const db = require('./config/database');
const voteRoutes = require('./routes/voteRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Initialize database tables
db.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to MySQL database');
  
  const createTables = `
    CREATE TABLE IF NOT EXISTS votes_osis (
      id INT AUTO_INCREMENT PRIMARY KEY,
      candidate_id VARCHAR(10),
      timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE TABLE IF NOT EXISTS votes_mpk (
      id INT AUTO_INCREMENT PRIMARY KEY,
      candidate_id VARCHAR(10),
      timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  
  db.query(createTables, (err) => {
    if (err) console.error('Error creating tables:', err);
    else console.log('Database tables ready');
  });
});

// Routes
app.use('/api', voteRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});