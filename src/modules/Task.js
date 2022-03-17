export default class Task {
    constructor(title, description="", dueDate="", priority) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.completed = false;
    }

    
}

// code (event listeners not working for projects in group2)
// const prjs = document.querySelectorAll(".group-1>div:not(.wrap)");
        // const prj2 = document.querySelectorAll(".group-2>div:not(.title)");
        // // console.log("for test", prjs);
        // prjs.forEach(project => {
        //     // console.log(project);
        //     project.addEventListener("click", UI.test)
        // });

        // console.log(prj2);
        // prj2.forEach(project => {
        //     // console.log(project);
        //     project.addEventListener("click", UI.test)
        // });
        // function() {
        //     console.log("work here");
        //     // UI.deleteCurrentProjectContent();
        //     // UI.loadTasks();
        //     // UI.createAddTaskButton();
        //     // UI.attachAddTaskButtonListeners();
        // })); 