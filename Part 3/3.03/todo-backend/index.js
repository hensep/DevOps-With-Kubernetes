const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 3001;

// Database configuration
const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: 5432,
});

// Initialize the database
const initializeDatabase = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS todos (
        id SERIAL PRIMARY KEY,
        text TEXT NOT NULL
      );
    `);
    console.log('Database initialized');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Use Morgan for HTTP request logging
app.use(morgan('combined'));

// GET /todos - Fetch all todos
app.get('/todos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM todos');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST /todos - Create a new todo
app.post('/todos', async (req, res) => {
  const { text } = req.body;

  if (!text || text.length > 140) {
    console.warn('Todo text is invalid or exceeds 140 characters');
    return res.status(400).json({ error: 'Todo text is required and must be less than 140 characters' });
  }

  try {
    const result = await pool.query('INSERT INTO todos (text) VALUES ($1) RETURNING *', [text]);
    console.log('Todo created successfully:', result.rows[0]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating todo:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/', (req,res) => {
  res.status(200).send();
})
app.get('/todos', (req,res) => {
  res.status(200).send();
})

// Start the server
app.listen(PORT, async () => {
  await initializeDatabase();
  console.log(`Todo-backend server started on port ${PORT}`);
});