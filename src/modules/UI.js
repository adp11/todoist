import { format } from 'date-fns'
import Task from './Task';
import Project from './Project';
import TodoList from './TodoList';
import Storage from './Storage';
import { getDateToday, getThisWeekRange, isInInterval, isInvalidFormat } from './Utilities';

export default class UI {

    // LOADING CONTENT
    static loadHomepage() {
        UI.loadProjects();
        UI.attachProjectListeners();
        UI.createAddProjectButton();
        UI.attachAddProjectButtonListeners();

        // open default project (Today) 
        // UI.openProject();
    }

    static loadProjects() {
        console.log("data",Storage.getTodoList().getProjects());
        Storage.getTodoList().getProjects().forEach(project => {
            if (project.isUserCreated()) {
                UI.createProject(project.getName()); // except "today, this week, wrap" ones - YYYY-MM-DD
            }
            console.log(typeof project);
        });  
    }

    static createProject(projectName) {
        const projectList = document.querySelector(".sidebar>.group-2");
        projectList.innerHTML += `
        <div><span class="material-icons-round">format_list_bulleted</span>${projectName}</div>`;    
    }

    static createAddProjectButton() {
        const projectList = document.querySelector(".sidebar>.group-2");
        projectList.innerHTML += `
        <div class="add-project-button">
            <span class="material-icons-round">add</span>Add project
        </div>`;
    }   

    static loadTasks(currentProject) {

        // load tasks for the selected project
        const todoList = Storage.getTodoList();
        let tasks = [];   
        if (currentProject.includes("Today")) {
            const todayProject = getDateToday();
            const thisWeekRange = getThisWeekRange(); // [start, end]
            const thisWeekProject = `${thisWeekRange[0]} > ${thisWeekRange[1]}`;


            // // get tasks in thisWeekProject that has dueDate of today
            // const wproject = todoList.find(thisWeekProject);
            // if (wproject !== undefined) {
            //     tasks = tasks.concat(wproject.getTodayTasks(todayProject));
            // }

            // get tasks of that OWN project
            const tproject = todoList.find(todayProject);
            if (tproject !== undefined) {
                tasks = tproject.getTasks();
            }

            // scrape through Storage to find any more task that also has dueDate of today
            todoList.getProjects().forEach(prj => {
                if (prj.isUserCreated()) {
                    tasks = tasks.concat(prj.getTodayTasks(todayProject));
                }
            })

            // // scrape through Storage to find any more task that also has dueDate of within this week
            // todoList.getProjects().forEach(prj => {
            //     if (prj.isUserCreated()) {
            //         tasks = tasks.concat(prj.getThisWeekTasks(thisWeekRange));
            //     }
            // })
            

            // display that data
            const main = document.querySelector(".main-content");
            main.innerHTML += `<h1>Today</h1>`;

        } else if (currentProject.includes("This week")) {
            const todayProject = getDateToday();
            const thisWeekRange = getThisWeekRange(); // [start, end]
            const thisWeekProject = `${thisWeekRange[0]} > ${thisWeekRange[1]}`;

            // // get tasks of todayProject 
            // const tProject = todoList.find(todayProject);
            // if (tProject !== undefined) {
            //     tasks = tProject.getTasks();
            // }

            // get tasks of thisWeekProject
            const project = todoList.find(thisWeekProject);
            if (project !== undefined) {
                tasks = tasks.concat(project.getTasks());
            }

            // scrape through Storage to find any more task that also has dueDate of within this week
            todoList.getProjects().forEach(prj => {
                if (prj.isUserCreated()) {
                    tasks = tasks.concat(prj.getThisWeekTasks(thisWeekRange));
                }
            })

            // display that data
            const main = document.querySelector(".main-content");
            main.innerHTML += `<h1>This week</h1>`;

        } else {
            const targetProjectName = currentProject.slice(20); // 20 is the length of "format_list_bulleted" 

            // get data of that user-created project
            const project = todoList.find(targetProjectName);
            if (project !== undefined) {
                tasks = project.getTasks();
            }
            
            // display that data
            const main = document.querySelector(".main-content");
            main.innerHTML += `<h1>${project.name}</h1>`;
        }

        tasks.forEach(task => UI.createTask(task)); 
    }

    static createTask(task) {
        const main = document.querySelector(".main-content");
        main.innerHTML += `
            <div class="task">
                <input type="checkbox" id="task">
                <span>${task.title}</span>
                <button>Notes</button>
                <span>${task.dueDate}</span>
                <span class="material-icons-round">edit</span>
                <span class="material-icons-round">delete</span>
            </div>`;
    }

    static createAddTaskButton() {
        const taskList = document.querySelector(".main-content");
        taskList.innerHTML += `
        <div class="add-task-button">
            <span class="material-icons-round">add</span>Add task
        </div>`;
    }


    // EVENT LISTENERS FOR "ADD PROJECT" BUTTON
    static createProjectFormPopup() {
        const addProjectButton = document.querySelector(".add-project-button");
        addProjectButton.style.display="none";

        const projectList = document.querySelector(".sidebar>.group-2");
        projectList.innerHTML += `
            <div class="project-form">
                <input type="text" name="project-name" id="new-project-name">
                <div class="form-buttons">
                    <button>Add</button>
                    <button>Cancel</button>
                </div>
            <div>`; 
    }

    static closeProjectFormPopup(event) {
        const projectForm = document.querySelector(".project-form");
        const addProjectButton = document.querySelector(".add-project-button");
        const submitProjectButton = document.querySelector(".form-buttons>button:first-child");   
        const cancelProjectButton = document.querySelector(".form-buttons>button:last-child");
        const projects = document.querySelectorAll(".group-2>*:not(.title)");

        if (event.target === submitProjectButton) {
            projects.forEach(project => project.remove());
            UI.loadProjects();
            UI.attachProjectListeners();
            UI.createAddProjectButton();
            UI.attachAddProjectButtonListeners();

        } else if (event.target === cancelProjectButton) {
            projectForm.remove();
            addProjectButton.style.display = "flex";
            UI.attachAddProjectButtonListeners(); // losing listeners when being applied "display: none" earlier
        }
    }

    static attachProjectFormButtonListeners() {
        const newProject = document.getElementById("new-project-name");
        const submitProjectButton = document.querySelector(".form-buttons>button:first-child");   
        const cancelProjectButton = document.querySelector(".form-buttons>button:last-child");

        // submit via click
        submitProjectButton.addEventListener("click", (event) => {
                // prevent user-created projects that have this reserved name format of "yyyy-mm/dd"
                if (isInvalidFormat(newProject.value)) {
                    Storage.addProject(newProject.value);
                    UI.closeProjectFormPopup(event);
                } else {
                    alert("This project name was already reserved. Please pick a new name.")
                }
            });

        // // submit via "enter"
        // submitProjectButton.addEventListener("keypress", (event) => {
        //     if (event.keyCode === 13) {
        //         Storage.addProject(newProject.value);
        //         UI.closeProjectFormPopup(event);
        //     }
        // })

        cancelProjectButton.addEventListener("click", UI.closeProjectFormPopup)
    }

    static attachAddProjectButtonListeners() {
        const addButton = document.querySelector(".group-2>div:last-of-type");
        addButton.addEventListener("click", () => {
            UI.createProjectFormPopup();
            UI.attachProjectFormButtonListeners();
        });
    }
    

    // EVENT LISTENERS FOR PROJECTS
    static deleteCurrentProjectContent() {
        const mainContent = document.querySelectorAll(".main-content>*");
        mainContent.forEach(element => element.remove());
    }

    static attachProjectListeners() {
        // .group-1>div:not(.wrap), 
        const projectList = document.querySelectorAll(".group-1>div:not(.wrap), .group-2>div:not(.title)");
        console.log(projectList);
        projectList.forEach(project => project.addEventListener("click", () => {
            // console.log("test", this);
            UI.deleteCurrentProjectContent();
            UI.loadTasks(project.textContent.trim());
            UI.createAddTaskButton();
            UI.attachAddTaskButtonListeners();
        }));
    }


    // EVENT LISTENERS FOR "ADD TASK" BUTTON
    static createTaskFormPopup() {
        const title = document.querySelector(".main-content>h1").textContent; 

        const addTaskButton = document.querySelector(".add-task-button");
        addTaskButton.style.display="none";
    
        const taskList = document.querySelector(".main-content");
        if (title === "Today") {
            taskList.innerHTML += `
            <div class="task-form">
                <input type="text" id="task-name" name="task-name" placeholder="*Task name">

                <input type="text" id="task-notes" name="task-notes" placeholder="Notes">

                <div class="form-row">
                    <label>*Priority: </label>
                    <input type="radio" id="low-priority" name="priority" value="low">
                    <label for="low-priority"> Low</label>
            
                    <input type="radio" id="medium-priority" name="priority" value="medium">
                    <label for="medium-priority"> Medium</label>
            
                    <input type="radio" id="high-priority" name="priority" value="high">
                    <label for="high-priority"> High</label>
                </div>
                <div class="form-buttons">
                    <button>Add</button>
                    <button>Cancel</button>
                </div>
            <div>`; 
        } else {
            taskList.innerHTML += `
            <div class="task-form">
                <input type="text" id="task-name" name="task-name" placeholder="*Task name">

                <input type="text" id="task-notes" name="task-notes" placeholder="Notes">
                
                <div class="form-row">
                    <label for="dueDate">Due date: </label>
                    <input type="date" id="dueDate" name="dueDate">
                </div>

                <div class="form-row">
                    <label>*Priority: </label>
                    <input type="radio" id="low-priority" name="priority" value="low">
                    <label for="low-priority"> Low</label>
            
                    <input type="radio" id="medium-priority" name="priority" value="medium">
                    <label for="medium-priority"> Medium</label>
            
                    <input type="radio" id="high-priority" name="priority" value="high">
                    <label for="high-priority"> High</label>
                </div>
                <div class="form-buttons">
                    <button>Add</button>
                    <button>Cancel</button>
                </div>
            <div>`; 
        }
        
    }

    static closeTaskFormPopup(event) {
        const taskForm = document.querySelector(".task-form");
        const addTaskButton = document.querySelector(".add-task-button");
        const submitTaskButton = document.querySelector(".task-form>.form-buttons>button:first-child");   
        const cancelTaskButton = document.querySelector(".task-form>.form-buttons>button:last-child");

        const main = document.querySelectorAll(".main-content>*"); 
        const project = document.querySelector(".main-content>h1").textContent.trim();

        if (event.target === submitTaskButton) {
            main.forEach(task => task.remove());
            UI.loadTasks(project);
            // UI.attachTaskListeners();
            UI.createAddTaskButton();
            UI.attachAddTaskButtonListeners();

        } else if (event.target === cancelTaskButton) {
            taskForm.remove();
            addTaskButton.style.display = "flex";
            UI.attachAddTaskButtonListeners(); // losing listeners when being applied "display: none"
        }
    }

    static addTasktoTodayProject(taskName, taskNotes, priority) {
        const todayProject = getDateToday();
        const newTask = new Task(taskName, priority, taskNotes, todayProject);
        Storage.addTask(todayProject, newTask);

    }

    static addTasktoThisWeekProject(taskName, taskNotes, priority, dueDate) {
        const thisWeekRange = getThisWeekRange(); // [start, end]
        const thisWeekProject = `${thisWeekRange[0]} > ${thisWeekRange[1]}`;

        // Handle dueDate input if this fn is invoked as a side-effect of adding to TodayProject
        if (dueDate === null) {
            const dateToday = getDateToday();
            const newTask = new Task(taskName, priority, taskNotes, dateToday);
            Storage.addTask(thisWeekProject, newTask);

        // Handle empty and out-of-range dueDate input 
        } else if (dueDate.value === "" || isInInterval(dueDate.value, thisWeekRange)) {
            const newTask = new Task(taskName, priority, taskNotes, dueDate.value);
            Storage.addTask(thisWeekProject, newTask);

        } else {
            alert("Due date is not within this week.")
            return;
        }
    }

    static addTasktoUserCreatedProject(taskName, priority, taskNotes, dueDate) {
        const targetProjectName = target.slice(20); // 20 is the length of "format_list_bulleted" 
        const newTask = new Task(taskName, priority, taskNotes, dueDate.value);
        Storage.addTask(targetProjectName, newTask);
    }

    static processTaskFormSubmission() {
        const title = document.querySelector(".main-content>h1").textContent;  
        const taskName = document.querySelector("#task-name").value;
        let priority = "";
        const taskNotes = document.querySelector("#task-notes").value;
        const dueDate = document.querySelector("#dueDate");
        const dateToday = getDateToday();

        // Handle task name and priority input
        if (taskName === "" || document.querySelector('input[type="radio"]:checked') === null) {
            alert("Task name and/or priority fields are required.");
            return;
        } else {
            priority = document.querySelector('input[type="radio"]:checked').value;
        }
        
        // console.log(taskName, taskNotes, priority);

        if (title === "Today") {
            UI.addTasktoTodayProject(taskName, priority, taskNotes);
            UI.addTasktoThisWeekProject(taskName, priority, taskNotes, dueDate);

        } else if (title === "This week") {
            UI.addTasktoThisWeekProject(taskName, priority, taskNotes, dueDate);
            if (dueDate.value === dateToday) {
                UI.addTasktoTodayProject(taskName, priority, taskNotes);
            }

        } else {
            UI.addTasktoUserCreatedProject(taskName, priority, taskNotes, dueDate);
        }
    }

    static attachTaskFormButtonListeners() {
        const submitTaskButton = document.querySelector(".task-form>.form-buttons>button:first-child");   
        const cancelTaskButton = document.querySelector(".task-form>.form-buttons>button:last-child");

        // submit via click
        submitTaskButton.addEventListener("click", (event) => {
                UI.processTaskFormSubmission();
                UI.closeTaskFormPopup(event);
            });

        // // submit via "enter"
        // submitTaskButton.addEventListener("keypress", (event) => {
        //     if (event.keyCode === 13) {
        //         UI.processTaskFormSubmission();
        //         UI.closeTaskFormPopup(event);
        //     }
        // })

        cancelTaskButton.addEventListener("click", UI.closeTaskFormPopup)
    }

    static attachAddTaskButtonListeners() {
        const addButton = document.querySelector(".main-content>div:last-of-type");
        addButton.addEventListener("click", () => {
            UI.createTaskFormPopup();
            UI.attachTaskFormButtonListeners();
        });
    }


    // EVENT LISTENERS FOR TASKS
}