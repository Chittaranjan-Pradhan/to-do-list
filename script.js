// ===============================
// Get elements from HTML
// ===============================

const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");


// ===============================
// Task Array
// ===============================

let tasks = [];


// ===============================
// Update Task Overview
// ===============================

function updateTaskCount() {

    const totalTasks = tasks.length;

    let completed = 0;

    tasks.forEach(function(task) {

        if (task.completed) {
            completed++;
        }

    });

    const active = totalTasks - completed;


    // Update right-side overview

    document.getElementById("totalCount").textContent = totalTasks;

    document.getElementById("overviewActive").textContent = active;

    document.getElementById("overviewCompleted").textContent = completed;
}


// ===============================
// Save Tasks
// ===============================

function saveTasks() {

    localStorage.setItem("tasks", JSON.stringify(tasks));

}


// ===============================
// Create Task Element
// ===============================

function createTaskElement(task) {

    // Create list item

    const li = document.createElement("li");


    // Create checkbox

    const checkbox = document.createElement("input");

    checkbox.type = "checkbox";

    checkbox.checked = task.completed;


    // Create task text

    const span = document.createElement("span");

    span.textContent = task.text;


    // Create Edit button

    const editBtn = document.createElement("button");

    editBtn.textContent = "✏️";

    editBtn.title = "Edit";


    // Create Delete button

    const deleteBtn = document.createElement("button");

    deleteBtn.textContent = "🗑️";

    deleteBtn.title = "Delete";


    // Add elements to task

    li.appendChild(checkbox);

    li.appendChild(span);

    li.appendChild(editBtn);

    li.appendChild(deleteBtn);


    // Add task to page

    taskList.appendChild(li);


    // Show completed style

    if (task.completed) {

        span.style.textDecoration = "line-through";

    }


    // ===============================
    // Complete / Uncomplete
    // ===============================

    checkbox.addEventListener("change", function() {

        task.completed = checkbox.checked;


        if (checkbox.checked) {

            span.style.textDecoration = "line-through";

        } else {

            span.style.textDecoration = "none";

        }


        saveTasks();

        updateTaskCount();

        applyCurrentFilter();

    });


    // ===============================
    // Edit Task
    // ===============================

    editBtn.addEventListener("click", function() {

        const newTask = prompt(
            "Edit your task:",
            span.textContent
        );


        if (newTask !== null && newTask.trim() !== "") {

            task.text = newTask.trim();

            span.textContent = task.text;

            saveTasks();

        }

    });


    // ===============================
    // Delete Task
    // ===============================

    deleteBtn.addEventListener("click", function() {

        const index = tasks.indexOf(task);


        if (index !== -1) {

            tasks.splice(index, 1);

        }


        li.remove();

        saveTasks();

        updateTaskCount();

    });

}


// ===============================
// Add New Task
// ===============================

addTaskBtn.addEventListener("click", function() {

    const taskText = taskInput.value.trim();


    // Don't allow empty task

    if (taskText === "") {

        return;

    }


    // Create task object

    const task = {

        text: taskText,

        completed: false

    };


    // Add task to array

    tasks.push(task);


    // Display task

    createTaskElement(task);


    // Save task

    saveTasks();


    // Clear input

    taskInput.value = "";


    // Update overview

    updateTaskCount();


    // Apply current filter

    applyCurrentFilter();

});


// ===============================
// Add Task Using Enter
// ===============================

taskInput.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {

        addTaskBtn.click();

    }

});


// ===============================
// Sidebar Filters
// ===============================

const filterButtons = document.querySelectorAll(
    ".sidebar-item[data-filter]"
);

let currentFilter = "all";


filterButtons.forEach(function(button) {

    button.addEventListener("click", function() {


        // Remove active from all sidebar filters

        filterButtons.forEach(function(btn) {

            btn.classList.remove("active");

        });


        // Add active to clicked button

        button.classList.add("active");


        // Get selected filter

        currentFilter = button.dataset.filter;
        const taskHeading = document.getElementById("taskHeading");

        if (currentFilter === "all") {

            taskHeading.textContent = "All Tasks";

        }

        else if (currentFilter === "active") {

            taskHeading.textContent = "Active Tasks";

        }

        else if (currentFilter === "completed") {

            taskHeading.textContent = "Completed Tasks";

}


        // Apply filter

        applyCurrentFilter();

    });

});


// ===============================
// Apply Current Filter
// ===============================

function applyCurrentFilter() {

    const taskElements = taskList.querySelectorAll("li");


    taskElements.forEach(function(li, index) {

        const task = tasks[index];


        if (currentFilter === "all") {

            li.style.display = "flex";

        }


        else if (currentFilter === "active") {

            if (task.completed) {

                li.style.display = "none";

            } else {

                li.style.display = "flex";

            }

        }


        else if (currentFilter === "completed") {

            if (task.completed) {

                li.style.display = "flex";

            } else {

                li.style.display = "none";

            }

        }

    });

}


// ===============================
// Load Saved Tasks
// ===============================

function loadTasks() {

    const savedTasks = localStorage.getItem("tasks");


    if (savedTasks) {

        tasks = JSON.parse(savedTasks);


        tasks.forEach(function(task) {

            createTaskElement(task);

        });

    }


    updateTaskCount();

    applyCurrentFilter();

}


// ===============================
// Load Tasks When Page Opens
// ===============================

loadTasks();