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