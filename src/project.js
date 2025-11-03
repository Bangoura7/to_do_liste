// Classe Project pour gérer les projets et leurs todos
export class Project {
    constructor(name) {
        this.id = Date.now() + Math.random();
        this.name = name;
        this.todos = [];
        this.createdAt = new Date().toISOString();
    }

    addTodo(todo) {
        this.todos.push(todo);
    }

    removeTodo(todoId) {
        this.todos = this.todos.filter(todo => todo.id !== todoId);
    }

    getTodo(todoId) {
        return this.todos.find(todo => todo.id === todoId);
    }

    getAllTodos() {
        return this.todos;
    }

    getActiveTodos() {
        return this.todos.filter(todo => !todo.completed);
    }

    getCompletedTodos() {
        return this.todos.filter(todo => todo.completed);
    }

    getTodosByPriority(priority) {
        return this.todos.filter(todo => todo.priority === priority);
    }

    updateName(newName) {
        this.name = newName;
    }
}
