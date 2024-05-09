// Function to retrieve tasks from local storage
function getTasksFromLocalStorage() {
    const storedTasks = localStorage.getItem("tasks");
    return storedTasks ? JSON.parse(storedTasks) : [];
}

// Function to save tasks to local storage
function saveTasksToLocalStorage(tasks) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Function to add a new task
function addTask() {
    const taskInput = document.getElementById("taskInput");
    const prioritySelect = document.getElementById("prioritySelect");
    const dueDateInput = document.getElementById("dueDateInput");
    const taskText = taskInput.value.trim();
    const priority = prioritySelect.value;
    const dueDate = dueDateInput.value;

    if (taskText === "") {
        alert("Please enter a task.");
        return;
    }

    const taskList = document.getElementById("taskList");
    const newTask = document.createElement("li");

    // Determine the font color, background color, and rounded corners based on priority
    let fontColor;
    let backgroundColor;
    let borderRadius;

    if (priority === "high") {
        fontColor = "red";
        backgroundColor = "white";
        borderRadius = "20px";
    } else if (priority === "medium") {
        fontColor = "green";
        backgroundColor = "white";
        borderRadius = "20px";
    } else if (priority === "low") {
        fontColor = "blue";
        backgroundColor = "white";
        borderRadius = "20px";
    } else {
        fontColor = "black";
        backgroundColor = "white";
        borderRadius = "20px";
    }

    newTask.innerHTML = `
        <div class="task" style="color: ${fontColor}; background-color: ${backgroundColor}; border-radius: ${borderRadius};">
            <input type="checkbox" onchange="markAsCompleted(this)" style="margin-right: -10px;">
            <span class="task-text">${taskText}</span>
            <span class="priority">${priority}</span>
            <input type="date" class="due-date" value="${dueDate}">
            <button onclick="removeTask(this)">Remove</button>
        </div>
    `;

    // Find the correct position to insert the new task based on priority
    let inserted = false;
    const tasks = taskList.getElementsByClassName("task");
    for (let i = 0; i < tasks.length; i++) {
        const existingPriority = tasks[i].querySelector(".priority").textContent;
        if (priority === "high" && existingPriority !== "high") {
            taskList.insertBefore(newTask, tasks[i].parentElement);
            inserted = true;
            break;
        } else if (priority === "medium" && (existingPriority === "low" || existingPriority === "medium")) {
            taskList.insertBefore(newTask, tasks[i].parentElement);
            inserted = true;
            break;
        } else if (priority === "low" && existingPriority === "low") {
            taskList.insertBefore(newTask, tasks[i].parentElement);
            inserted = true;
            break;
        }
    }

    // If the task wasn't inserted yet, add it at the end
    if (!inserted) {
        taskList.appendChild(newTask);
    }

    // Clear input fields
    taskInput.value = "";
    dueDateInput.value = "";

    // Save tasks to local storage
    const tasksFromLocalStorage = getTasksFromLocalStorage();
    tasksFromLocalStorage.push({
        text: taskText,
        priority: priority,
        dueDate: dueDate,
        completed: false
    });
    saveTasksToLocalStorage(tasksFromLocalStorage);
}

// Function to mark a task as completed
function markAsCompleted(checkbox) {
    const taskList = document.getElementById("taskList");
    const completedList = document.getElementById("completedList");
    const taskItem = checkbox.parentElement;
    const tasksFromLocalStorage = getTasksFromLocalStorage();

    if (checkbox.checked) {
        completedList.appendChild(taskItem);
        // Update the completed status in local storage
        const taskText = taskItem.querySelector(".task-text").textContent;
        const task = tasksFromLocalStorage.find(item => item.text === taskText);
        if (task) {
            task.completed = true;
            saveTasksToLocalStorage(tasksFromLocalStorage);
        }
    } else {
        taskList.appendChild(taskItem);
        // Update the completed status in local storage
        const taskText = taskItem.querySelector(".task-text").textContent;
        const task = tasksFromLocalStorage.find(item => item.text === taskText);
        if (task) {
            task.completed = false;
            saveTasksToLocalStorage(tasksFromLocalStorage);
        }
    }
}

// Function to remove a task
function removeTask(button) {
    const taskList = document.getElementById("taskList");
    const taskItem = button.parentElement.parentElement;
    const tasksFromLocalStorage = getTasksFromLocalStorage();
    const taskText = taskItem.querySelector(".task-text").textContent;

    // Remove the task from local storage
    const updatedTasks = tasksFromLocalStorage.filter(item => item.text !== taskText);
    saveTasksToLocalStorage(updatedTasks);

    taskList.removeChild(taskItem);
}

// Function to load tasks from local storage and display them
// Function to load tasks from local storage, sort them by priority and order of addition, and display them
// Function to load tasks from local storage, sort them by priority and order of addition, and display them
// Function to load tasks from local storage, sort them by priority, and display them
function loadTasks() {
    const tasksFromLocalStorage = getTasksFromLocalStorage();
    const taskList = document.getElementById("taskList");
    const completedList = document.getElementById("completedList");

    // Sort tasks by priority
    tasksFromLocalStorage.sort((a, b) => {
        if (a.priority === b.priority) {
            return 0;
        }
        if (a.priority === "high") {
            return -1;
        }
        if (b.priority === "high") {
            return 1;
        }
        if (a.priority === "medium") {
            return -1;
        }
        if (b.priority === "medium") {
            return 1;
        }
        return 0;
    });

    tasksFromLocalStorage.forEach(task => {
        const newTask = document.createElement("li");
        let fontColor;
        let backgroundColor;
        let borderRadius;

        if (task.priority === "high") {
            fontColor = "red";
            backgroundColor = "white";
            borderRadius = "20px";
        } else if (task.priority === "medium") {
            fontColor = "green";
            backgroundColor = "white";
            borderRadius = "20px";
        } else if (task.priority === "low") {
            fontColor = "blue";
            backgroundColor = "white";
            borderRadius = "20px";
        } else {
            fontColor = "black";
            backgroundColor = "white";
            borderRadius = "20px";
        }

        newTask.innerHTML = `
            <div class="task" style="color: ${fontColor}; background-color: ${backgroundColor}; border-radius: ${borderRadius};">
                <input type="checkbox" onchange="markAsCompleted(this)" style="margin-right: -10px;" ${task.completed ? "checked" : ""}>
                <span class="task-text">${task.text}</span>
                <span class="priority">${task.priority}</span>
                <input type="date" class="due-date" value="${task.dueDate}">
                <button onclick="removeTask(this)">Remove</button>
            </div>
        `;

        if (task.completed) {
            completedList.appendChild(newTask);
        } else {
            taskList.appendChild(newTask);
        }
    });
}

// Load tasks when the page is loaded
loadTasks();
