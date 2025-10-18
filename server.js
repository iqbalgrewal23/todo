// Import the Express framework
const express = require('express');
const path = require('path');

// Create an instance of the Express application
const app = express();
// Define the port the server will run on.
const PORT = 3000;

// --- MIDDLEWARE ---
// Allows the server to understand JSON data
app.use(express.json());
// Serves the frontend files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// --- IN-MEMORY "DATABASE" ---
// A simple array to store our tasks while the server is running
let tasks = [
    { id: 1, text: "Create a Node.js backend", completed: true },
    { id: 2, text: "Build the frontend interface", completed: false },
    { id: 3, text: "Connect frontend to backend", completed: false }
];
let currentId = 4;

// --- API ROUTES (The server's endpoints) ---

// [GET] /api/tasks - Get all tasks
app.get('/api/tasks', (req, res) => {
    res.json(tasks);
});

// [POST] /api/tasks - Add a new task
app.post('/api/tasks', (req, res) => {
    const { text } = req.body;
    const newTask = {
        id: currentId++,
        text: text,
        completed: false
    };
    tasks.push(newTask);
    res.status(201).json(newTask);
});

// [PATCH] /api/tasks/:id - Update a task's status
app.patch('/api/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const { completed } = req.body;
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.completed = completed;
        res.json(task);
    } else {
        res.status(404).json({ error: 'Task not found' });
    }
});

// [DELETE] /api/tasks/:id - Delete a task
app.delete('/api/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
        tasks.splice(taskIndex, 1);
        res.status(204).send();
    } else {
        res.status(404).json({ error: 'Task not found' });
    }
});

// --- START THE SERVER ---
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});