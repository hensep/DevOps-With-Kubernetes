const express = require('express');
const { Client } = require('pg');
const app = express();

// Read database credentials from environment variables
const dbConfig = {
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT || 5432
};

// Initialize database connection
const client = new Client(dbConfig);
client.connect()
  .then(() => {
    console.log('Connected to PostgreSQL database');
    // Create the table if it doesn't exist
    return client.query(`
      CREATE TABLE IF NOT EXISTS counter (
        id SERIAL PRIMARY KEY,
        count INT NOT NULL
      );
    `);
  })
  .then(() => {
    console.log('Counter table initialized');
  })
  .catch((err) => {
    console.error('Error connecting to database:', err);
  });

// Endpoint to increment and return the counter
app.get('/pingpong', async (req, res) => {
  try {
    // Increment the count in a single row
    const updatedResult = await client.query(`
      INSERT INTO counter (id, count)
      VALUES (1, 1)
      ON CONFLICT (id) DO UPDATE
      SET count = counter.count + 1
      RETURNING count;
    `);

    const newCount = updatedResult.rows[0].count;
    res.send(`pong ${newCount}`);
  } catch (err) {
    console.error('Error updating counter:', err);
    res.status(500).send('Internal Server Error');
  }
});

// Endpoint to get the current counter value
app.get('/count', async (req, res) => {
  try {
    const result = await client.query(`
      SELECT SUM(count) as total FROM counter;
    `);
    const total = result.rows[0].total || 0;
    res.json({ count: total });
  } catch (err) {
    console.error('Error fetching counter:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Ping-Pong App started on port ${PORT}`);
});