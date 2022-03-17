import Project from './Project';
import Task from './Task';
import TodoList from './TodoList';

// localStorage.getItem("key");
// localStorage.setItem("key", JSON.stringify(array))
// JSON.parse(localStorage.getItem("key")).//do something
// localStorage.clear()
// localStorage.removeItem("key")

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
        // const project = todoList.find(project)
        todoList.addProject(projectName);
        Storage.save(todoList);
    }

    // static deleteProject(projectName) {
    //     const todoList = Storage.getTodoList();
    //     todoList.deleteProject(projectName);
    //     Storage.save(todoList);
    // }
    
    static addTask(projectName, task) {
        const todoList = Storage.getTodoList();
        const project = todoList.find(projectName);
        console.log("test",project)
        if (project !== undefined) {
            project.addTask(task);
            // console.log("storage",task.title);
        } else {
            const length = todoList.getProjects().length;
            // console.log(todoList.getProjects()[length-1]);
            todoList.addProject(projectName);
            todoList.getProjects()[length].addTask(task);
        }
        
        Storage.save(todoList);
    }
    
    // static deleteTask(projectName, taskName) {
    //     const todoList = Storage.getTodoList();
    //     todoList.getProject(projectName).deleteTask(taskName);
    //     Storage.save(todoList);
    // }

}


