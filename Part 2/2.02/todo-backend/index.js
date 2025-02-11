const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3001;

// In-memory storage for todos
let todos = [
  { id: 1, text: 'Buy groceries' },
  { id: 2, text: 'Walk the dog' },
  { id: 3, text: 'Read a book' },
];

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// GET /todos - Fetch all todos
app.get('/todos', (req, res) => {
  res.json(todos);
});

// POST /todos - Create a new todo
app.post('/todos', (req, res) => {
  const { text } = req.body;
  if (!text || text.length > 140) {
    return res.status(400).json({ error: 'Todo text is required and must be less than 140 characters' });
  }

  const newTodo = {
    id: todos.length + 1,
    text,
  };

  todos.push(newTodo);
  res.status(201).json(newTodo);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Todo-backend server started on port ${PORT}`);
});