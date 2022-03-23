import Project from './Project';
import Task from './Task';
import TodoList from './TodoList';

export default class Storage {
    static save(data) {
        localStorage.setItem("todoList", JSON.stringify(data));
    }

    static getTodoList() {
        if (localStorage.getItem("todoList") === null) {
            localStorage.setItem("todoList", JSON.stringify([]));
        }
        
        const rawData = JSON.parse(localStorage.getItem("todoList"));

        const todoList = Object.assign(new TodoList(), rawData); 

        todoList.setProjects(
            todoList.getProjects()
                    .map(project => Object.assign(new Project(), project)));

        todoList.getProjects()
                .forEach(project => project.setTasks(project.getTasks()
                .map(task => Object.assign(new Task(), task))));
        
        return todoList;
    }

    static addProject(projectName) {
        const todoList = Storage.getTodoList();
        todoList.addProject(projectName);
        Storage.save(todoList);
    }
    
    static addTask(projectName, task) {
        const todoList = Storage.getTodoList();
        const project = todoList.find(projectName);
        const length = todoList.getProjects().length;
        let oldLength = 0;
        let newLength = 0;
        
        if (project !== undefined) {
            oldLength = project.getTasks().length;
            project.addTask(task);
            newLength = project.getTasks().length;

        } else {
            todoList.addProject(projectName);
            const newProject = todoList.getProjects()[length];
            oldLength = newProject.getTasks().length;
            newProject.addTask(task);
            newLength = newProject.getTasks().length;
        }
        
        Storage.save(todoList);
        return (oldLength !== newLength); // return value of if add was successful
    }

    static updateTask(projectName, titleComponents, dueDate, newTaskName, newPriority, newTaskNotes, newDueDate) {
        const todoList = Storage.getTodoList();

        if (titleComponents.length===1) {
            const project = todoList.find(projectName);
            if (project!==undefined) {
                const task = project.rawFind(titleComponents[0], dueDate);
                task.updateTask(newTaskName, newPriority, newTaskNotes, newDueDate);
            }
        } else {
            const project = todoList.find(titleComponents[1]);
            if (project!==undefined) {
                const task = project.rawFind(titleComponents[0], dueDate);
                task.updateTask(newTaskName, newPriority, newTaskNotes, newDueDate)
            }
        }
        Storage.save(todoList);
    }
    
    static deleteTask(projectName, titleComponents, dueDate) {
        const todoList = Storage.getTodoList();

        if (titleComponents.length===1) {
            const project = todoList.find(projectName);
            if (project!==undefined) {
                const targetIndex = project.rawFindIndex(titleComponents[0], dueDate);
                project.deleteTask(targetIndex);
                
            }
        } else {
            const project = todoList.find(titleComponents[1]);
            if (project!==undefined) {
                const targetIndex = project.rawFindIndex(titleComponents[0], dueDate);
                project.deleteTask(targetIndex);
            }
        }
        Storage.save(todoList);
    }

    static toggleTaskStatus(projectName, titleComponents, dueDate) {
        const todoList = Storage.getTodoList();

        if (titleComponents.length===1) {
            const project = todoList.find(projectName);
            if (project!==undefined) {
                const task = project.rawFind(titleComponents[0], dueDate);
                task.toggleTaskStatus();
            }
        } else {
            const project = todoList.find(titleComponents[1]);
            if (project!==undefined) {
                const task = project.rawFind(titleComponents[0], dueDate);
                task.toggleTaskStatus();
            }
        }
        Storage.save(todoList);
    }

    static getNotes(projectName, titleComponents, dueDate) {
        const todoList = Storage.getTodoList();

        if (titleComponents.length===1) {
            const project = todoList.find(projectName);
            if (project!==undefined) {
                const task = project.rawFind(titleComponents[0], dueDate);
                return [task.getNotes(), task.getStatus()];
            }
        } else {
            const project = todoList.find(titleComponents[1]);
            if (project!==undefined) {
                const task = project.rawFind(titleComponents[0], dueDate);
                return [task.getNotes(), task.getStatus()];
            }
        }
    }
}
