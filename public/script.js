// The public URL of your backend server, hosted on Render
const API_URL = 'https://todoapi-3c3t.onrender.com';

// --- DOM ELEMENT REFERENCES ---
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');

// --- API FUNCTIONS ---

// [GET] Fetches all tasks from the server
const fetchTasks = async () => {
    try {
        // Use the full API_URL to fetch tasks
        const response = await fetch(`${API_URL}/api/tasks`);
        if (!response.ok) {
            throw new Error('Could not fetch tasks');
        }
        const tasks = await response.json();
        renderTasks(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        alert('Could not connect to the server. Please ensure the backend is running and the URL is correct.');
    }
};

// [POST] Adds a new task
const addTask = async (text) => {
    try {
        // Use the full API_URL to add a task
        const response = await fetch(`${API_URL}/api/tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text }),
        });
        if (!response.ok) {
            throw new Error('Could not add task');
        }
        // After adding, refresh the whole list to show the new task
        fetchTasks();
    } catch (error) {
        console.error('Error adding task:', error);
    }
};

// [PATCH] Updates a task's completion status
const updateTaskStatus = async (id, completed) => {
    try {
        // Use the full API_URL to update a specific task
        await fetch(`${API_URL}/api/tasks/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ completed }),
        });
    } catch (error) {
        console.error('Error updating task:', error);
    }
};

// [DELETE] Deletes a task
const deleteTask = async (id) => {
    try {
        // Use the full API_URL to delete a specific task
        await fetch(`${API_URL}/api/tasks/${id}`, {
            method: 'DELETE',
        });
        // After deleting, refresh the list
        fetchTasks();
    } catch (error)
        {
        console.error('Error deleting task:', error);
    }
};


// --- RENDER FUNCTION ---
// Renders tasks to the DOM
const renderTasks = (tasks) => {
    taskList.innerHTML = ''; // Clear the existing list

    if (tasks.length === 0) {
        taskList.innerHTML = '<li class="no-tasks">No tasks yet. Add one above!</li>';
        return;
    }

    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = 'task-item';
        li.dataset.id = task.id;

        if (task.completed) {
            li.classList.add('completed');
        }

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.addEventListener('change', () => {
            const newStatus = checkbox.checked;
            li.classList.toggle('completed', newStatus);
            updateTaskStatus(task.id, newStatus);
        });
        
        const span = document.createElement('span');
        span.className = 'task-text';
        span.textContent = task.text;
        // Also allow toggling completion by clicking the text
        span.addEventListener('click', () => {
             checkbox.checked = !checkbox.checked;
             checkbox.dispatchEvent(new Event('change'));
        });

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.innerHTML = '&times;';
        deleteBtn.addEventListener('click', () => {
            deleteTask(task.id);
        });

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(deleteBtn);
        taskList.appendChild(li);
    });
};


// --- EVENT LISTENERS ---

// Handle form submission to add a new task
taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = taskInput.value.trim();
    if (text) {
        addTask(text);
        taskInput.value = '';
    }
});


// --- INITIALIZATION ---
// Fetch tasks when the page first loads
document.addEventListener('DOMContentLoaded', fetchTasks);