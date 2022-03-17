import { compareAsc, toDate } from 'date-fns';
import Project from './Project';
import Task from './Task';
import { isInvalidFormat } from './Utilities';

export default class TodoList {
    constructor() {
        this.projects = [];
    }

    getProjects() {
        return this.projects;
    }

    setProjects(projects) {
        this.projects = projects;
    }

    find(projectName) {
        return this.projects.find((prj) => prj.name === projectName);
    }

    addProject(projectName) {
        // prevent user-created projects that have this reserved name of "yyyy-mm/dd"
        // if (isInvalidFormat(projectName)) {
        //     alert("This project name was already reserved. Please pick a new name.")
        // } else 
        if (this.find(projectName) !== undefined) {
            alert("Project name already existed. Please pick a new name.");
        } else {
            this.projects.push(new Project(projectName));
        }
    }    
}