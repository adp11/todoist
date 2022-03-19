import Task from './Task';
import isWithinInterval from 'date-fns/isWithinInterval';
import { isInInterval } from './Utilities';

export default class Project {
    constructor(name) {
        this.name = name;
        this.tasks = [];
    }

    getName() {
        return this.name;
    }

    getTasks() {
        return this.tasks;
    }

    setTasks(tasks) {
        this.tasks = tasks;
    }

    // 'task' parameter must be a Task object
    find(task) {
        return this.tasks.find((t) => t.title === task.title);
    }

    // required parameters are pure strings
    // return values: a Task object
    rawFind(taskName, dueDate) {
        return this.tasks.find((t) =>
            // console.log(t.title, taskName);
            // console.log(t.dueDate, dueDate);
            (t.title===taskName && t.dueDate===dueDate))
    }

    // required parameters are pure strings
    // return values: index of Task object
    rawFindIndex(taskName, dueDate) {
        return this.tasks.findIndex((t) =>
            // console.log(t.title, taskName);
            // console.log(t.dueDate, dueDate);
            (t.title===taskName && t.dueDate===dueDate))
    }


    addTask(task) {
        const target = this.find(task);
        if (target !== undefined && target.dueDate === task.dueDate) {
            alert("Task name already existed. Please pick a new name.");
        } else {
            this.tasks.push(task);
        }
    }

    isUserCreated() {
        return this.getName().match(/([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/) === null;
    }   

    getTodayTasks(dateToday) {
        return this.getTasks().filter(task => task.dueDate === dateToday);
    }

    getThisWeekTasks(thisWeekRange) {
        const thisWeekTasks = this.getTasks().filter(task => isInInterval(task.dueDate, thisWeekRange));
        return thisWeekTasks;        
    }
}

// if (title === "Today") {
//     // only do the second add if the first add was successful
//     if (UI.addTasktoTodayProject(taskName, priority, taskNotes)) {
//         UI.addTasktoThisWeekProject(taskName, priority, taskNotes, dueDate);
//     }

// } else if (title === "This week") {
//     UI.addTasktoThisWeekProject(taskName, priority, taskNotes, dueDate);
//     if (dueDate.value === dateToday) {
//         UI.addTasktoTodayProject(taskName, priority, taskNotes);
//     }

// } else {
//     UI.addTasktoUserCreatedProject(title, taskName, priority, taskNotes, dueDate);
// }

// // get tasks of that OWN project
// const tproject = todoList.find(todayProject);
// if (tproject !== undefined) {
//     tasks = tproject.getTasks();
// }

// // scrape through Storage to find any more task that also has dueDate of today
// todoList.getProjects().forEach(prj => {
//     if (prj.isUserCreated()) {
//         tasks = tasks.concat(prj.getTodayTasks(todayProject));
//     }
// })
