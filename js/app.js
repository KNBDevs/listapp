document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('taskForm');
    const taskTable = document.getElementById('taskTable').querySelector('tbody');
    const sortByNameButton = document.getElementById('sortByName');
    const sortByDateButton = document.getElementById('sortByDate');
    const sortByTimeButton = document.getElementById('sortByTime');
    const notification = document.getElementById('notification');

    taskForm.addEventListener('submit', (event) => {
        event.preventDefault();
        
        const taskName = document.getElementById('taskName').value;
        const taskDescription = document.getElementById('taskDescription').value;
        const taskDate = document.getElementById('taskDate').value;
        const taskTime = document.getElementById('taskTime').value;
        const allDay = document.getElementById('allDay').checked;

        const task = {
            id: Date.now(),
            name: taskName,
            description: taskDescription,
            date: taskDate,
            time: allDay ? 'Todo el día' : taskTime
        };

        saveTask(task);
        addTaskToTable(task);
        taskForm.reset();
        showNotification('Tarea añadida');
    });

    sortByNameButton.addEventListener('click', () => sortTasks('name'));
    sortByDateButton.addEventListener('click', () => sortTasks('date'));
    sortByTimeButton.addEventListener('click', () => sortTasks('time'));

    loadTasks();

    function saveTask(task) {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => addTaskToTable(task));
    }

    function addTaskToTable(task) {
        const row = document.createElement('tr');
        row.dataset.id = task.id;

        row.innerHTML = `
            <td>${task.name}</td>
            <td>${task.date}</td>
            <td>${task.time}</td>
            <td>${task.description}</td>
            <td>
                <button class="edit" onclick="editTask(${task.id})">Editar</button>
                <button class="delete" onclick="deleteTask(${task.id})">Eliminar</button>
            </td>
        `;

        taskTable.appendChild(row);
    }

    window.editTask = function(taskId) {
        const task = getTaskById(taskId);
        if (!task) return;

        document.getElementById('taskName').value = task.name;
        document.getElementById('taskDescription').value = task.description;
        document.getElementById('taskDate').value = task.date;
        document.getElementById('taskTime').value = task.time === 'Todo el día' ? '' : task.time;
        document.getElementById('allDay').checked = task.time === 'Todo el día';

        deleteTask(taskId);
    }

    window.deleteTask = function(taskId) {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks = tasks.filter(task => task.id !== taskId);
        localStorage.setItem('tasks', JSON.stringify(tasks));

        const row = document.querySelector(`tr[data-id='${taskId}']`);
        if (row) {
            row.classList.add('removing');
            row.addEventListener('animationend', () => row.remove());
        }
        showNotification('Tarea eliminada');
    }

    function getTaskById(taskId) {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        return tasks.find(task => task.id === taskId);
    }

    function sortTasks(criterion) {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.sort((a, b) => {
            if (criterion === 'name') {
                return a.name.localeCompare(b.name);
            } else if (criterion === 'date') {
                return new Date(a.date) - new Date(b.date);
            } else if (criterion === 'time') {
                if (a.time === 'Todo el día' && b.time === 'Todo el día') return 0;
                if (a.time === 'Todo el día') return 1;
                if (b.time === 'Todo el día') return -1;
                return a.time.localeCompare(b.time);
            }
        });

        taskTable.innerHTML = '';
        tasks.forEach(task => addTaskToTable(task));
    }

    function showNotification(message) {
        notification.textContent = message;
        notification.style.display = 'block';
        setTimeout(() => {
            notification.style.display = 'none';
        }, 3000);
    }
});
