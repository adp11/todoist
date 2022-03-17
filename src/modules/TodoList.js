import { compareAsc, toDate } from 'date-fns';
import Project from './Project';
import Task from './Task';

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
        if (this.find(projectName) !== undefined) {
            alert("Project name already existed. Please pick a new name");
        } else {
            this.projects.push(new Project(projectName));
        }
        // if (this.projects.find((project) => project.name === projectName) !== undefined) {
        //     alert("Project name already existed. Please pick a new name");
        // } else {
        //     const newProject = new Project(projectName);
        //     this.projects.push(newProject);
        // }
    }
}