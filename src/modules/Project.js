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
        if (this.find(task) !== undefined) {
            // console.log("test",task.name);
            // console.log("test",this.find(task));
            alert("Task name already existed. Please pick a new name.");
        } else {
            this.tasks.push(task);
        }
    }

    isUserCreated() {
        return (this.getName().match(/(\d{4})-(\d{1,2})-(\d{1,2})/) === null );
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