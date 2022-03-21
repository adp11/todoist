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
            alert("Project name already existed. Please pick a new name.");
        } else {
            this.projects.push(new Project(projectName));
        }
    }    
}

// static toggleTaskStatus(task) {
//     const projectName = document.querySelector(".main-content>h3").textContent;
//     const titleComponents = extractComponents(task[TITLE].textContent);

//     if (projectName==="Today" && titleComponents.length===1) {
//         const thisWeekRange = getThisWeekRange();
//         const thisWeekProjectName = `${thisWeekRange[0]} > ${thisWeekRange[1]}`;

//         Storage.toggleTaskStatus(getDateToday(), titleComponents, task[DUE].textContent);
//         Storage.toggleTaskStatus(thisWeekProjectName, titleComponents, task[DUE].textContent);

//     } else if (projectName==="This week" && titleComponents.length===1) {
//         const thisWeekRange = getThisWeekRange();
//         const thisWeekProjectName = `${thisWeekRange[0]} > ${thisWeekRange[1]}`;

//         Storage.toggleTaskStatus(thisWeekProjectName, titleComponents, task[DUE].textContent)
//         if (task[DUE].textContent===getDateToday()) {
//             Storage.toggleTaskStatus(getDateToday(), titleComponents, task[DUE].textContent);
//         }

//     } else {
//         Storage.toggleTaskStatus(projectName, titleComponents, task[DUE].textContent)
//     }
// }