export default class Task {
  constructor(title, priority, notes, dueDate = '') {
    this.title = title;
    this.priority = priority;
    this.notes = notes;
    this.dueDate = dueDate;
    this.completed = false;
  }

  getNotes() {
    return this.notes;
  }

  getStatus() {
    return this.completed;
  }

  updateTask(newTitle, newPrio, newNotes, newDueDate) {
    this.title = newTitle;
    this.priority = newPrio;
    this.notes = newNotes;
    this.dueDate = newDueDate;
  }

  toggleTaskStatus() {
    this.completed = this.completed !== true;
  }
}
