const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const pino = require('pino');
const pinoLoki = require('pino-loki');


const transport = pino.transport({
  target: 'pino-loki',
  options: {
    host: 'http://loki.loki-stack:3100',
    labels: { app: 'todo-backend' },
  }
});

const logger = pino(transport);

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

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Log every request
app.use((req, res, next) => {
  logger.info({ method: req.method, url: req.url, body: req.body }, 'Request received');
  next();
});

// GET /todos - Fetch all todos
app.get('/todos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM todos');
    res.json(result.rows);
  } catch (error) {
    logger.error({ error }, 'Error fetching todos');
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST /todos - Create a new todo
app.post('/todos', async (req, res) => {
  const { text } = req.body;

  if (!text || text.length > 140) {
    logger.warn({ text }, 'Todo text is invalid or exceeds 140 characters');
    return res.status(400).json({ error: 'Todo text is required and must be less than 140 characters' });
  }

  try {
    const result = await pool.query('INSERT INTO todos (text) VALUES ($1) RETURNING *', [text]);
    logger.info({ todo: result.rows[0] }, 'Todo created successfully');
    res.status(201).json(result.rows[0]);
  } catch (error) {
    logger.error({ error }, 'Error creating todo');
    res.status(500).json({ error: 'Internal Server Error' });
  }
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
    logger.info('Database initialized');
  } catch (error) {
    logger.error({ error }, 'Error initializing database');
  }
};

// Start the server
app.listen(PORT, async () => {
  await initializeDatabase();
  logger.info(`Todo-backend server started on port ${PORT}`);
});
