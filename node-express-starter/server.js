const express = require('express');
const path = require('path');

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

let todos = [
  { id: 1, text: "Learn Express.js", completed: false },
  { id: 2, text: "Build a REST API", completed: false },
  { id: 3, text: "Connect to a database", completed: false }
];

app.get('/api/todos', (req, res) => {
  res.json(todos);
});

app.get('/api/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const todo = todos.find(todo => todo.id === id);
  if (!todo) {
    return res.status(404).json({ message: 'Todo not found' });
  }
  res.json(todo);
});

app.post('/api/todos', (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ message: 'Text is required' });
  }
  const id = todos.length > 0 ? Math.max(...todos.map(todo => todo.id)) + 1 : 1;
  const newTodo = { id, text, completed: false };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

app.put('/api/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const todoIndex = todos.findIndex(todo => todo.id === id);
  if (todoIndex === -1) {
    return res.status(404).json({ message: 'Todo not found' });
  }
  const { text, completed } = req.body;
  const updatedTodo = {
    ...todos[todoIndex],
    text: text !== undefined ? text : todos[todoIndex].text,
    completed: completed !== undefined ? completed : todos[todoIndex].completed
  };
  todos[todoIndex] = updatedTodo;
  res.json(updatedTodo);
});

app.delete('/api/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const todoIndex = todos.findIndex(todo => todo.id === id);
  if (todoIndex === -1) {
    return res.status(404).json({ message: 'Todo not found' });
  }
  todos.splice(todoIndex, 1);
  res.status(204).send();
});

app.all('*', (req, res) => {
  res.status(404).json({ message: '404 - Endpoint Not Found' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Todo API server running on port ${PORT}`);
});