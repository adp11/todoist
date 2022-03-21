import Task from './Task';
import Project from './Project';
import TodoList from './TodoList';
import Storage from './Storage';
import { getDateToday, getThisWeekRange, isInInterval, isValidFormat, extractComponents } from './Utilities';

// positions of buttons inside every ".task" element
const CHECKBOX = 0;
const TITLE = 1;
const DUE = 2;
const NOTES = 3;
const EDIT = 4;
const DELETE = 5;

export default class UI {

    // LOADING CONTENT
    static loadHomepage() {

        // order of loading matters because of a glitch related to "innerHTML+=" and "losing event listeners" when switching createAddButton and attachProjects
        UI.loadProjects();
        UI.createAddProjectButton();
        UI.attachProjectListeners();
        UI.attachAddProjectButtonListeners();
        UI.openProject();
        UI.attachTaskListeners();
    }

    static openProject(projectName="Today") {
        UI.loadTasks(projectName);
        UI.createAddTaskButton();
        UI.attachAddTaskButtonListeners();
        UI.attachTaskListeners();
    }

    static loadProjects() {
        Storage.getTodoList().getProjects().forEach(project => {
            if (project.isUserCreated()) {
                UI.createProject(project.getName());
            }
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
        <div class="add-project-button"><span class="material-icons-round">add</span>Add project</div>`;
    }   

    static loadTasks(projectName) {

        // load tasks for the selected project
        const todoList = Storage.getTodoList();
        let tasks = [];   
        if (projectName.includes("Today")) {
            const todayProject = getDateToday();

            // First, scrape through Storage to find any task that has dueDate of today.
            todoList.getProjects().forEach(prj => {
                if (prj.isUserCreated()) {
                    const extraTasks = prj.getTodayTasks(todayProject);
                    const modifiedExtraTasks = extraTasks.map(extraTask => [extraTask, prj.getName()]); // Add source of this extra scraped task for display purpose in loadTasks()
                    tasks = tasks.concat(modifiedExtraTasks);
                }
            })

            // Second, get tasks of that OWN project
            const project = todoList.find(todayProject);
            if (project !== undefined) {
                tasks = tasks.concat(project.getTasks().map(task => [task]));
            }

            const main = document.querySelector(".main-content");
            main.innerHTML += `<h3>Today</h3>`;

        } else if (projectName.includes("This week")) {
            const thisWeekRange = getThisWeekRange();
            const thisWeekProject = `${thisWeekRange[0]} > ${thisWeekRange[1]}`;

            // First, scrape through Storage to find any task that has dueDate of within this week.
            todoList.getProjects().forEach(prj => {
                if (prj.isUserCreated()) {
                    const extraTasks = prj.getThisWeekTasks(thisWeekRange);
                    const modifiedExtraTasks = extraTasks.map(extraTask => [extraTask, prj.getName()]); // Add source of this extra scraped task for display purpose in loadTasks()

                    tasks = tasks.concat(modifiedExtraTasks);
                }
            })

            // Second, get tasks of thisWeekProject
            const project = todoList.find(thisWeekProject);
            if (project !== undefined) {
                tasks = tasks.concat(project.getTasks().map(task => [task]));
            }

            const main = document.querySelector(".main-content");
            main.innerHTML += `<h3>This week</h3>`;

        } else {
            // project name can be extracted from title of ".main-content" or "sidebar"
            const targetProjectName = (projectName.includes("format_list_bulleted")) ? projectName.slice(20) : projectName; // 20 is the length of "format_list_bulleted" 
        
            // get tasks of that user-created project
            const project = todoList.find(targetProjectName);
            if (project !== undefined) {
                tasks = project.getTasks().map(task => [task]);
            }
            
            const main = document.querySelector(".main-content");
            main.innerHTML += `<h3>${project.name}</h3>`;
        }

        // display that data
        tasks.forEach((task, idx) => UI.createTask(task, idx)); 
    }

    static addPrioritytoTask(task, idx) {
        const currentTask = document.querySelector(`.task${idx}`);
        
        (task.priority==="low") ? currentTask.classList.add("low-prio") :
        (task.priority==="medium") ? currentTask.classList.add("medium-prio") : currentTask.classList.add("high-prio"); 
    }

    // task parameter: [a Task object, optional task source]
    static createTask(task, idx) {
        const main = document.querySelector(".main-content");

        if (task.length===1) {
            if (task[0].completed) {
                main.innerHTML += `
                <div class="task task${idx}"> 
                    <input type="checkbox" id="task${idx}" checked>
                    <label>${task[0].title}</label>
                    <div class="date" style="margin-left: auto;">${task[0].dueDate}</div>
                    <button >Notes</button>
                    <span class="material-icons-outlined">edit</span>
                    <span class="material-icons-round">delete</span>
                </div>`;
    
                // idx parameter needed because of this purpose below
                const currentTask = document.querySelector(`.task${idx}`);
                currentTask.classList.add("completed");
    
            } else {
                main.innerHTML += `
                <div class="task task${idx}"> 
                    <input type="checkbox" id="task${idx}">
                    <label>${task[0].title}</label>
                    <div class="date" style="margin-left: auto;">${task[0].dueDate}</div>
                    <button >Notes</button>
                    <span class="material-icons-outlined">edit</span>
                    <span class="material-icons-round">delete</span>
                </div>`;
            }

        } else {
            if (task[0].completed) {
                main.innerHTML += `
                <div class="task task${idx}"> 
                    <input type="checkbox" id="task${idx}" checked>
                    <label>${task[0].title} (${task[1]})</label>
                    <div class="date" style="margin-left: auto;">${task[0].dueDate}</div>
                    <button >Notes</button>
                    <span class="material-icons-outlined">edit</span>
                    <span class="material-icons-round">delete</span>
                </div>`;
    
                // idx parameter needed because of this purpose below
                const currentTask = document.querySelector(`.task${idx}`);
                currentTask.classList.add("completed");
    
            } else {
                main.innerHTML += `
                <div class="task task${idx}"> 
                    <input type="checkbox" id="task${idx}">
                    <label>${task[0].title} (${task[1]})</label>
                    <div class="date" style="margin-left: auto;">${task[0].dueDate}</div>
                    <button >Notes</button>
                    <span class="material-icons-outlined">edit</span>
                    <span class="material-icons-round">delete</span>
                </div>`;
            }
        }
        // idx parameter needed because of this purpose below
        UI.addPrioritytoTask(task[0], idx);                                  
    }

    static createAddTaskButton() {
        const taskList = document.querySelector(".main-content");
        taskList.innerHTML += `
        <div class="add-task-button">
            <span class="material-icons-round" style="margin-right: 5px">add</span>Add task
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
            UI.createAddProjectButton();
            UI.attachProjectListeners();
            UI.attachAddProjectButtonListeners();

        } else if (event.target === cancelProjectButton) {
            projectForm.remove();
            addProjectButton.style.display = "flex";
            UI.attachAddProjectButtonListeners(); // attach again because losing listeners when being applied "display: none" earlier
        }
    }

    static attachProjectFormButtonListeners() {
        const newProject = document.getElementById("new-project-name");
        const submitProjectButton = document.querySelector(".project-form>.form-buttons>button:first-child");   
        const cancelProjectButton = document.querySelector(".project-form>.form-buttons>button:last-child");

        // submit via click
        submitProjectButton.addEventListener("click", (event) => {
                // prevent user-created projects that have this reserved name format of "yyyy-mm/dd"
                if (newProject.value.trim() === "" || /[(,)]/.test(newProject.value.trim())) {
                    alert("Project name must not be empty and/or not include '(' or ')'.")
                } else if (isValidFormat(newProject.value)) {
                    Storage.addProject(newProject.value.trim());
                    UI.closeProjectFormPopup(event);
                } else {
                    alert("This project name was already reserved. Please pick a new name.")
                }
            });

        cancelProjectButton.addEventListener("click", UI.closeProjectFormPopup)
    }

    static attachAddProjectButtonListeners() {
        const addButton = document.querySelector(".group-2>div:last-of-type");
        addButton.addEventListener("click", () => {
            UI.createProjectFormPopup();
            UI.attachProjectListeners(); // attach again because event listeners for projects got lost as a result of using "innerHTML +=" above
            UI.attachProjectFormButtonListeners();
        });
    }
    

    // EVENT LISTENERS FOR PROJECTS
    static deleteCurrentProjectContent() {
        const mainContent = document.querySelectorAll(".main-content>*");
        mainContent.forEach(element => element.remove());
    }

    static attachProjectListeners() {
        const projectList = document.querySelectorAll(".group-1>div:not(.wrap), .group-2>div:not(.title, .add-project-button, .project-form)");
        projectList.forEach(project => project.addEventListener("click", () => {
            UI.deleteCurrentProjectContent();
            UI.loadTasks(project.textContent.trim());
            UI.createAddTaskButton();
            UI.attachTaskListeners();
            UI.attachAddTaskButtonListeners();
        }));
    }

    /* Popup from edit OR submit
    1. Error in (((taskHTML!==null) && (taskHTML.contains(event.target))) ||  (taskHTML!==null)) ==> createPopup, attachPopupButton (closePopup, submit/save Popup)
    2. Isolate submission and save features. Make the others work first.
    */

    // EVENT LISTENERS FOR "ADD TASK" BUTTON
    static attachAddTaskButtonListeners() {
        const addButton = document.querySelector(".add-task-button");
        addButton.addEventListener("click", (event) => {
            UI.deleteCurrentNotesPopup();// newly added
            UI.deleteCurrentTaskFormPopup(); // newly added
            UI.createTaskFormPopup(event);
            UI.attachTaskFormButtonListeners(event);
        });
    }

    static createTaskFormPopup(event, task=null, position=null) {
        // const taskHTML = document.querySelectorAll(".task");
        const main = document.querySelector(".main-content");
        const title = document.querySelector(".main-content>h3").textContent; 
        

        if ((task !== null) && (task[EDIT]===event.target)) {

            const editForm = document.createElement("div");
            editForm.classList.add("edit-form");

            if (title === "Today") {
                editForm.innerHTML += `
                    <input type="text" id="task-name" name="task-name" placeholder="*New task name (${task[TITLE].textContent})">
    
                    <input type="text" id="task-notes" name="task-notes" placeholder="New notes">


                    <div class="prio-row">
                        <span style="width: 120px">*New priority:</span>
                        <input type="radio" id="low-priority" name="priority" value="low">
                        <label for="low-priority"> Low</label>
                
                        <input type="radio" id="medium-priority" name="priority" value="medium">
                        <label for="medium-priority"> Medium</label>
                
                        <input type="radio" id="high-priority" name="priority" value="high">
                        <label for="high-priority"> High</label>
                    </div>
                    <div class="form-buttons">
                        <button>Save</button>
                        <button>Cancel</button>
                    </div>`;
    
            } else {
                editForm.innerHTML += `
                    <input type="text" id="task-name" name="task-name" placeholder="*New task name (${task[TITLE].textContent})">
    
                    <input type="text" id="task-notes" name="task-notes" placeholder="Notes">

                    <div class="date-row">
                        <label for="dueDate">Due date: </label>
                        <input type="date" id="dueDate" name="dueDate" value="${task[DUE].textContent}">
                    </div>

                    <div class="prio-row">
                        <span>*New priority:</span>
                        <input type="radio" id="low-priority" name="priority" value="low">
                        <label for="low-priority"> Low</label>
                
                        <input type="radio" id="medium-priority" name="priority" value="medium">
                        <label for="medium-priority"> Medium</label>
                
                        <input type="radio" id="high-priority" name="priority" value="high">
                        <label for="high-priority"> High</label>
                    </div>

                    <div class="form-buttons">
                        <button>Save</button>
                        <button>Cancel</button>
                    </div>`;
            }
            main.insertBefore(editForm, main.children[position+2]);

        } else {
            console.log("submit here", task, event.target);
            const taskList = document.querySelector(".main-content");
            const addTaskButton = document.querySelector(".add-task-button");
            addTaskButton.style.display="none";

            if (title === "Today") {
                taskList.innerHTML += `
                <div class="task-form">
                    <input type="text" id="task-name" name="task-name" placeholder="*Task name">
    
                    <input type="text" id="task-notes" name="task-notes" placeholder="Notes">
    
                    <div class="prio-row">
                        <span>*Priority:</span>
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
                    
                    <div class="date-row">
                        <label for="dueDate">Due date: </label>
                        <input type="date" id="dueDate" name="dueDate">
                    </div>
    
                    <div class="prio-row">
                        <span>*Priority:</span>
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
    }
    
    static attachTaskFormButtonListeners(event, task=null) {
        // console.log("@@@");
        // console.log(task[EDIT]);
        // console.log(task.includes(event.target));
        // console.log(position);
        // console.log("@@@");

        if ((task !== null) && (task[EDIT]===event.target)) {
            // console.log("edit here");
            const saveEditButton = document.querySelector(".edit-form>.form-buttons>button:first-child");   
            const cancelEditButton = document.querySelector(".edit-form>.form-buttons>button:last-child");

            // submit via click
            saveEditButton.addEventListener("click", (e) => {
                UI.processTaskFormSubmission("edit", task); // e OR event? extra params?
                UI.closeTaskFormPopup(e, task);
            });

            cancelEditButton.addEventListener("click", (e) => {
                UI.closeTaskFormPopup(e, task)
            });
            
        } else {
            // console.log("submit here");
            const submitTaskButton = document.querySelector(".task-form>.form-buttons>button:first-child");   
            const cancelTaskButton = document.querySelector(".task-form>.form-buttons>button:last-child");

            // submit via click
            submitTaskButton.addEventListener("click", (e) => {
                UI.processTaskFormSubmission();
                UI.closeTaskFormPopup(e);
            });

            cancelTaskButton.addEventListener("click", (e) => UI.closeTaskFormPopup(e));
        }
    }


    static processTaskFormSubmission(type="add", task=null) {
        

        const title = document.querySelector(".main-content>h3").textContent;  
        const taskName = document.querySelector("#task-name").value;
        let priority = "";
        const taskNotes = document.querySelector("#task-notes").value;
        const dueDate = document.querySelector("#dueDate");
        const dateToday = getDateToday();

        console.log("////")
        console.log(dueDate);
        console.log("////")

        // Validate task name input
        if (taskName.trim() === "" || /[(,)]/.test(taskName.trim())) {
            alert("Task name must not be empty and/or not include '(' or ')'.");

        // Validate priority input 
        } else if (document.querySelector('input[type="radio"]:checked') === null) {
            alert("Priority field is required");

        } else {
            priority = document.querySelector('input[type="radio"]:checked').value;
        
            if (type==="edit") {
                
                
                UI.updateTask(task, taskName, priority, taskNotes, dueDate);

            } else {
                if (title === "Today") {
                    // only do the second add if the first add was successful
                    if (UI.addTasktoTodayProject(taskName, priority, taskNotes)) {
                        UI.addTasktoThisWeekProject(taskName, priority, taskNotes, dueDate);
                    }
    
                } else if (title === "This week") {
                    // only do the second add if the first add was successful
                    if (UI.addTasktoThisWeekProject(taskName, priority, taskNotes, dueDate)) {
                        if (dueDate.value === dateToday) {
                            UI.addTasktoTodayProject(taskName, priority, taskNotes);
                        }
                    }
    
                } else {
                    UI.addTasktoUserCreatedProject(title, taskName, priority, taskNotes, dueDate);
                }
            }
            
        }
    }

    static updateTask(task, newTaskName, newPriority, newTaskNotes, newDueDate) {
        const projectName = document.querySelector(".main-content>h3").textContent;
        const titleComponents = extractComponents(task[TITLE].textContent);

        if (projectName==="Today" && titleComponents.length===1) {
            const thisWeekRange = getThisWeekRange();
            const thisWeekProjectName = `${thisWeekRange[0]} > ${thisWeekRange[1]}`;
    
            Storage.updateTask(getDateToday(), titleComponents, task[DUE].textContent, newTaskName, newPriority, newTaskNotes, getDateToday());
            Storage.updateTask(thisWeekProjectName, titleComponents, task[DUE].textContent, newTaskName, newPriority, newTaskNotes, getDateToday());
    
        } else if (projectName==="This week" && titleComponents.length===1) {
            const thisWeekRange = getThisWeekRange();
            const thisWeekProjectName = `${thisWeekRange[0]} > ${thisWeekRange[1]}`;
    
            Storage.updateTask(thisWeekProjectName, titleComponents, task[DUE].textContent, newTaskName, newPriority, newTaskNotes, newDueDate.value);
            if (task[DUE].textContent===getDateToday()) {
                Storage.updateTask(getDateToday(), titleComponents, task[DUE].textContent, newTaskName, newPriority, newTaskNotes, newDueDate.value);
            }
    
        } else {
            Storage.updateTask(projectName, titleComponents, task[DUE].textContent, newTaskName, newPriority, newTaskNotes, newDueDate.value);
        }
    }

    static addTasktoTodayProject(taskName, priority, taskNotes) {
        const todayProject = getDateToday();
        const newTask = new Task(taskName, priority, taskNotes, todayProject);
        const succeeded = Storage.addTask(todayProject, newTask);
        return succeeded;
    }

    static addTasktoThisWeekProject(taskName, priority, taskNotes, dueDate) {
        const thisWeekRange = getThisWeekRange();
        const thisWeekProject = `${thisWeekRange[0]} > ${thisWeekRange[1]}`;
        let succeeded = false;

        // Handle dueDate input if this fn is invoked as a side-effect of adding to TodayProject
        if (dueDate === null) {
            const dateToday = getDateToday();
            const newTask = new Task(taskName, priority, taskNotes, dateToday);
            succeeded = Storage.addTask(thisWeekProject, newTask);

        // Handle empty and out-of-range dueDate input 
        } else if (dueDate.value === "" || isInInterval(dueDate.value, thisWeekRange)) {
            const newTask = new Task(taskName, priority, taskNotes, dueDate.value);
            succeeded = Storage.addTask(thisWeekProject, newTask);

        } else {
            alert("Due date is not within this week.")
        }

        return succeeded;
    }

    static addTasktoUserCreatedProject(projectName, taskName, priority, taskNotes, dueDate) {
        // const targetProjectName = target.slice(20); // 20 is the length of "format_list_bulleted" 
        const newTask = new Task(taskName, priority, taskNotes, dueDate.value);
        Storage.addTask(projectName, newTask);
    }
    
    static closeTaskFormPopup(event, task=null) {
        const editForm = document.querySelector(".edit-form");
        const taskForm = document.querySelector(".task-form");
        const addTaskButton = document.querySelector(".add-task-button");
        const main = document.querySelectorAll(".main-content>*"); 
        const projectName = document.querySelector(".main-content>h3").textContent.trim();

        if ((task !== null) && (editForm.contains(event.target))) {
            const saveEditButton = document.querySelector(".edit-form>.form-buttons>button:first-child");   
            const cancelEditButton = document.querySelector(".edit-form>.form-buttons>button:last-child");

            if (event.target === saveEditButton) {
                main.forEach(task => task.remove());
                UI.loadTasks(projectName);
                UI.createAddTaskButton();
                UI.attachTaskListeners();
                UI.attachAddTaskButtonListeners();
    
            } else if (event.target === cancelEditButton) {
                editForm.remove();
            }

        } else {

            const submitTaskButton = document.querySelector(".task-form>.form-buttons>button:first-child");   
            const cancelTaskButton = document.querySelector(".task-form>.form-buttons>button:last-child");
            if (event.target === submitTaskButton) {
                main.forEach(task => task.remove());
                UI.loadTasks(projectName);
                UI.createAddTaskButton();
                UI.attachTaskListeners();
                UI.attachAddTaskButtonListeners();
    
            } else if (event.target === cancelTaskButton) {
                taskForm.remove();
                addTaskButton.style.display = "flex";
                UI.attachAddTaskButtonListeners(); // attach again because losing listeners when being applied "display: none"
                UI.attachTaskListeners();
            }
        }
    }
    
    // EVENT LISTENERS FOR TASKS
    static attachTaskListeners() {
        const projectName = document.querySelector(".main-content>h3").textContent;
        const taskList = document.querySelectorAll(".main-content>.task");
        taskList;
        
        taskList.forEach((task, idx) => {
            const taskButtons = task.children;
            
            // EVENT LISTENERS FOR TOGGLE
            taskButtons[CHECKBOX].addEventListener("click", () => {
                UI.toggleTaskStatus(taskButtons);
                UI.deleteCurrentProjectContent();
                UI.openProject(projectName);
            });

            // EVENT LISTENERS FOR NOTES
            taskButtons[NOTES].addEventListener("click", () => {
                UI.deleteCurrentNotesPopup();
                UI.deleteCurrentTaskFormPopup();
                UI.openNotesPopup(taskButtons, idx);
                // event.stopImmediatePropagation(); // duct tape
                UI.attachNotesPopupClose();

            });
            
            // EVENT LISTENERS FOR EDIT
            taskButtons[EDIT].addEventListener("click", (event) => {
                // console.log("001", taskButtons[EDIT], event.target, idx)
                UI.deleteCurrentNotesPopup();
                UI.deleteCurrentTaskFormPopup();
                UI.createTaskFormPopup(event, taskButtons, idx);
                // event.stopImmediatePropagation(); // duct tape
                
                UI.attachTaskFormButtonListeners(event, taskButtons);
            });

            // EVENT LISTENERS FOR DELETE
            taskButtons[DELETE].addEventListener("click", () => {
                UI.deleteTask(taskButtons);
                UI.deleteCurrentProjectContent();
                UI.openProject(projectName);
            });
        })
    }

    static deleteCurrentTaskFormPopup() {
        const currentEditForm = document.querySelector(".task-form");
        const currentTaskForm = document.querySelector(".edit-form");

        if (currentEditForm!==null) currentEditForm.remove();
        if (currentTaskForm!==null) currentTaskForm.remove();
        
    }

    // HELPER FUNCTIONS FOR TASK TOGGLE
    static toggleTaskStatus(task) {
        const projectName = document.querySelector(".main-content>h3").textContent;
        const titleComponents = extractComponents(task[TITLE].textContent);

        if (projectName==="Today" && titleComponents.length===1) {
            const thisWeekRange = getThisWeekRange();
            const thisWeekProjectName = `${thisWeekRange[0]} > ${thisWeekRange[1]}`;

            Storage.toggleTaskStatus(getDateToday(), titleComponents, task[DUE].textContent);
            Storage.toggleTaskStatus(thisWeekProjectName, titleComponents, task[DUE].textContent);

        } else if (projectName==="This week" && titleComponents.length===1) {
            const thisWeekRange = getThisWeekRange();
            const thisWeekProjectName = `${thisWeekRange[0]} > ${thisWeekRange[1]}`;

            Storage.toggleTaskStatus(thisWeekProjectName, titleComponents, task[DUE].textContent)
            if (task[DUE].textContent===getDateToday()) {
                Storage.toggleTaskStatus(getDateToday(), titleComponents, task[DUE].textContent);
            }

        } else {
            Storage.toggleTaskStatus(projectName, titleComponents, task[DUE].textContent)
        }
    }

    
    // HELPER FUNCTIONS FOR TASK NOTES
    static deleteCurrentNotesPopup() {
        const currentPopup = document.querySelector(".main-content>.notes-form");
        if (currentPopup!==null) currentPopup.remove();
    }

    static openNotesPopup(task, position) {
        const projectName = document.querySelector(".main-content>h3").textContent;
        const titleComponents = extractComponents(task[TITLE].textContent);

        if (projectName==="Today" && titleComponents.length===1) {
            const [notes, status] = Storage.getNotes(getDateToday(), titleComponents, task[DUE].textContent);
            UI.createNotesPopup(notes, position, status);

        } else if (projectName==="This week" && titleComponents.length===1) { 
            const thisWeekRange = getThisWeekRange();
            const thisWeekProjectName = `${thisWeekRange[0]} > ${thisWeekRange[1]}`;

            const [notes, status] = Storage.getNotes(thisWeekProjectName, titleComponents, task[DUE].textContent);
            UI.createNotesPopup(notes, position, status);

        } else {
            const [notes, status] = Storage.getNotes(projectName, titleComponents, task[DUE].textContent);
            UI.createNotesPopup(notes, position, status);
        }
    }

    static createNotesPopup(notes, position, taskStatus) {
        const main = document.querySelector(".main-content");
        const notesForm = document.createElement("div");
        
        notesForm.classList.add("notes-form");
        notesForm.innerHTML += `
                <div class="material-icons-outlined notes-popup-close" style="font-size: 2rem;">close</div>
                <div class="notes-box"><span style="font-weight: bold; font-size: 1.5rem;">Notes: </span>${notes}</div>`;

        main.insertBefore(notesForm, main.children[position+2]);

        if (taskStatus!==false) {
            notesForm.classList.add("completed");
        }
    }

    static attachNotesPopupClose() {
        const popupClose = document.querySelector(".notes-popup-close");
        popupClose.addEventListener("click", UI.deleteCurrentNotesPopup)
    }


    // HELPER FUNCTIONS FOR TASK DELETE
    static deleteTask(task) {
        const projectName = document.querySelector(".main-content>h3").textContent;
        const titleComponents = extractComponents(task[TITLE].textContent);

        if (projectName==="Today" && titleComponents.length===1) {
            const thisWeekRange = getThisWeekRange();
            const thisWeekProjectName = `${thisWeekRange[0]} > ${thisWeekRange[1]}`;

            Storage.deleteTask(getDateToday(), titleComponents, task[DUE].textContent);
            Storage.deleteTask(thisWeekProjectName, titleComponents, task[DUE].textContent);

        } else if (projectName==="This week" && titleComponents.length===1) {
            const thisWeekRange = getThisWeekRange();
            const thisWeekProjectName = `${thisWeekRange[0]} > ${thisWeekRange[1]}`;

            Storage.deleteTask(thisWeekProjectName, titleComponents, task[DUE].textContent)
            if (task[DUE].textContent===getDateToday()) {
                Storage.deleteTask(getDateToday(), titleComponents, task[DUE].textContent);
            }

        } else {
            Storage.deleteTask(projectName, titleComponents, task[DUE].textContent)
        }
    }
}