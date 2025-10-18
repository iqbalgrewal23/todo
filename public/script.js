// --- DOM ELEMENT REFERENCES ---
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');

// --- API FUNCTIONS ---

// [GET] Fetches all tasks from the server
const fetchTasks = async () => {
    try {
        const response = await fetch('/api/tasks');
        const tasks = await response.json();
        renderTasks(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
    }
};

// [POST] Adds a new task
const addTask = async (text) => {
    try {
        await fetch('/api/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text }),
        });
        fetchTasks(); // Refresh the list after adding
    } catch (error) {
        console.error('Error adding task:', error);
    }
};

// [PATCH] Updates a task's completion status
const updateTaskStatus = async (id, completed) => {
    try {
        await fetch(`/api/tasks/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ completed }),
        });
    } catch (error) {
        console.error('Error updating task:', error);
    }
};

// [DELETE] Deletes a task
const deleteTask = async (id) => {
    try {
        await fetch(`/api/tasks/${id}`, {
            method: 'DELETE',
        });
        fetchTasks(); // Refresh the list after deleting
    } catch (error) {
        console.error('Error deleting task:', error);
    }
};


// --- RENDER FUNCTION ---
// Renders tasks to the webpage
const renderTasks = (tasks) => {
    taskList.innerHTML = ''; // Clear the existing list

    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = 'task-item';
        if (task.completed) {
            li.classList.add('completed');
        }

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.addEventListener('change', () => {
            updateTaskStatus(task.id, checkbox.checked);
            li.classList.toggle('completed', checkbox.checked);
        });
        
        const span = document.createElement('span');
        span.className = 'task-text';
        span.textContent = task.text;
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.innerHTML = '&times;';
        deleteBtn.addEventListener('click', () => deleteTask(task.id));

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(deleteBtn);
        taskList.appendChild(li);
    });
};


// --- EVENT LISTENERS ---
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