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

    find(task) {
        return this.tasks.find((t) => t.title === task.title);
    }

    // task names within "this week" category must be unique
    addTask(task) {
        const target = this.find(task);
        if (target !== undefined && target.dueDate === task.dueDate) {
            // console.log("test",task.name);
            // console.log("test",this.find(task));
            alert("Task name already existed. Please pick a new name.");
        } else {
            this.tasks.push(task);
        }
    }

    isUserCreated() {
        // console.log("test",this)
        return this.getName().match(/([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/) === null;
    }   

    getTodayTasks(dateToday) {
        // const a = this.getTasks().filter(task => task.dueDate === dateToday);
        // console.log(a);
        return this.getTasks().filter(task => task.dueDate === dateToday);
    }

    getThisWeekTasks(thisWeekRange) {
        const thisWeekTasks = this.getTasks().filter(task => isInInterval(task.dueDate, thisWeekRange));
        return thisWeekTasks;        
    }
}