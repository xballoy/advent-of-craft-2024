// Comment: rename to TaskManager to reflect the business logic.
export class ElfWorkshop {
  // Comment: do not use a primitive here. Because a task is a domain object it should be represented as is.
  // If the task is just a string no problem, but not using a primitive will allow to add more to it later or at least explicit it.
  taskList: string[] = [];

  // Comment: all path return void, but some path do things and other don't.
  // Maybe return an object success: true/false or an option that return the added task.
  addTask(task: string): void {
    if (task !== '') {
      this.taskList.push(task);
    }
  }

  // Comment: some path return null, some return a string.
  // Maybe return an object success: true/false or an option that return the completed task.
  completeTask(): string | null {
    if (this.taskList.length > 0) {
      return this.taskList.shift() ?? null;
    }
    return null;
  }
}
