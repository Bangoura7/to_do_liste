// Module de logique métier - AUCUNE manipulation DOM ici
// Seulement la logique pure de l'application

export class TodoLogic {
    static createTodo(title, description, dueDate, priority = 'medium', notes = '', checklist = []) {
        return {
            id: Date.now() + Math.random(),
            title,
            description,
            dueDate,
            priority,
            notes,
            checklist: checklist.map(item => ({
                id: Date.now() + Math.random(),
                text: item.text || item,
                completed: item.completed || false
            })),
            completed: false,
            createdAt: new Date().toISOString()
        };
    }

    static toggleComplete(todo) {
        todo.completed = !todo.completed;
        return todo;
    }

    static updateTodo(todo, updates) {
        return { ...todo, ...updates };
    }

    static addChecklistItem(todo, text) {
        const newItem = {
            id: Date.now() + Math.random(),
            text,
            completed: false
        };
        todo.checklist.push(newItem);
        return todo;
    }

    static toggleChecklistItem(todo, itemId) {
        const item = todo.checklist.find(i => i.id === itemId);
        if (item) {
            item.completed = !item.completed;
        }
        return todo;
    }

    static removeChecklistItem(todo, itemId) {
        todo.checklist = todo.checklist.filter(i => i.id !== itemId);
        return todo;
    }

    static updatePriority(todo, priority) {
        todo.priority = priority;
        return todo;
    }

    static isOverdue(todo) {
        if (todo.completed) return false;
        const dueDate = new Date(todo.dueDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return dueDate < today;
    }

    static isDueToday(todo) {
        const dueDate = new Date(todo.dueDate);
        const today = new Date();
        return dueDate.toDateString() === today.toDateString();
    }

    static isDueSoon(todo, days = 7) {
        if (todo.completed) return false;
        const dueDate = new Date(todo.dueDate);
        const today = new Date();
        const futureDate = new Date(today);
        futureDate.setDate(futureDate.getDate() + days);
        return dueDate >= today && dueDate <= futureDate;
    }

    static getChecklistProgress(todo) {
        if (!todo.checklist || todo.checklist.length === 0) {
            return { completed: 0, total: 0, percentage: 0 };
        }
        const completed = todo.checklist.filter(item => item.completed).length;
        const total = todo.checklist.length;
        const percentage = Math.round((completed / total) * 100);
        return { completed, total, percentage };
    }
}

export class ProjectLogic {
    static createProject(name) {
        return {
            id: Date.now() + Math.random(),
            name,
            todos: [],
            createdAt: new Date().toISOString()
        };
    }

    static addTodo(project, todo) {
        project.todos.push(todo);
        return project;
    }

    static removeTodo(project, todoId) {
        project.todos = project.todos.filter(t => t.id !== todoId);
        return project;
    }

    static getTodo(project, todoId) {
        return project.todos.find(t => t.id === todoId);
    }

    static updateTodo(project, todoId, updates) {
        const todo = project.todos.find(t => t.id === todoId);
        if (todo) {
            Object.assign(todo, updates);
        }
        return project;
    }

    static getAllTodos(project) {
        return project.todos;
    }

    static getActiveTodos(project) {
        return project.todos.filter(t => !t.completed);
    }

    static getCompletedTodos(project) {
        return project.todos.filter(t => t.completed);
    }

    static getTodosByPriority(project, priority) {
        return project.todos.filter(t => t.priority === priority);
    }

    static getOverdueTodos(project) {
        return project.todos.filter(t => TodoLogic.isOverdue(t));
    }

    static getTodayTodos(project) {
        return project.todos.filter(t => TodoLogic.isDueToday(t));
    }

    static getUpcomingTodos(project) {
        return project.todos.filter(t => TodoLogic.isDueSoon(t));
    }

    static updateProjectName(project, newName) {
        project.name = newName;
        return project;
    }

    static getStats(project) {
        const total = project.todos.length;
        const completed = project.todos.filter(t => t.completed).length;
        const active = total - completed;
        const overdue = project.todos.filter(t => TodoLogic.isOverdue(t)).length;
        const today = project.todos.filter(t => TodoLogic.isDueToday(t)).length;
        
        return {
            total,
            completed,
            active,
            overdue,
            today,
            completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
        };
    }
}

export class AppLogic {
    constructor() {
        this.projects = [];
        this.currentProjectId = null;
        this.loadFromStorage();
        
        if (this.projects.length === 0) {
            this.createDefaultProject();
        }
    }

    createDefaultProject() {
        const defaultProject = ProjectLogic.createProject('Mon Projet');
        this.projects.push(defaultProject);
        this.currentProjectId = defaultProject.id;
        this.saveToStorage();
    }

    addProject(name) {
        const project = ProjectLogic.createProject(name);
        this.projects.push(project);
        this.saveToStorage();
        return project;
    }

    removeProject(projectId) {
        if (this.projects.length <= 1) {
            return { success: false, message: 'Vous devez avoir au moins un projet !' };
        }
        
        this.projects = this.projects.filter(p => p.id !== projectId);
        
        if (this.currentProjectId === projectId) {
            this.currentProjectId = this.projects[0].id;
        }
        
        this.saveToStorage();
        return { success: true };
    }

    getProject(projectId) {
        return this.projects.find(p => p.id === projectId);
    }

    getCurrentProject() {
        return this.getProject(this.currentProjectId);
    }

    setCurrentProject(projectId) {
        this.currentProjectId = projectId;
        this.saveToStorage();
    }

    getAllProjects() {
        return this.projects;
    }

    // Opérations sur les todos
    addTodoToCurrentProject(todoData) {
        const project = this.getCurrentProject();
        if (!project) return null;
        
        const todo = TodoLogic.createTodo(
            todoData.title,
            todoData.description,
            todoData.dueDate,
            todoData.priority,
            todoData.notes,
            todoData.checklist
        );
        
        ProjectLogic.addTodo(project, todo);
        this.saveToStorage();
        return todo;
    }

    removeTodoFromCurrentProject(todoId) {
        const project = this.getCurrentProject();
        if (!project) return false;
        
        ProjectLogic.removeTodo(project, todoId);
        this.saveToStorage();
        return true;
    }

    updateTodoInCurrentProject(todoId, updates) {
        const project = this.getCurrentProject();
        if (!project) return null;
        
        ProjectLogic.updateTodo(project, todoId, updates);
        this.saveToStorage();
        return this.getTodoFromCurrentProject(todoId);
    }

    getTodoFromCurrentProject(todoId) {
        const project = this.getCurrentProject();
        if (!project) return null;
        
        return ProjectLogic.getTodo(project, todoId);
    }

    toggleTodoComplete(todoId) {
        const todo = this.getTodoFromCurrentProject(todoId);
        if (!todo) return null;
        
        TodoLogic.toggleComplete(todo);
        this.saveToStorage();
        return todo;
    }

    updateTodoPriority(todoId, priority) {
        const todo = this.getTodoFromCurrentProject(todoId);
        if (!todo) return null;
        
        TodoLogic.updatePriority(todo, priority);
        this.saveToStorage();
        return todo;
    }

    // Filtrage
    filterTodos(filter) {
        const project = this.getCurrentProject();
        if (!project) return [];
        
        switch (filter) {
            case 'all':
                return ProjectLogic.getAllTodos(project);
            case 'active':
                return ProjectLogic.getActiveTodos(project);
            case 'completed':
                return ProjectLogic.getCompletedTodos(project);
            case 'today':
                return ProjectLogic.getTodayTodos(project);
            case 'upcoming':
                return ProjectLogic.getUpcomingTodos(project);
            case 'overdue':
                return ProjectLogic.getOverdueTodos(project);
            case 'high':
            case 'medium':
            case 'low':
                return ProjectLogic.getTodosByPriority(project, filter);
            default:
                return ProjectLogic.getAllTodos(project);
        }
    }

    // Statistiques
    getCurrentProjectStats() {
        const project = this.getCurrentProject();
        if (!project) return null;
        
        return ProjectLogic.getStats(project);
    }

    getAllProjectsStats() {
        return this.projects.map(project => ({
            projectId: project.id,
            projectName: project.name,
            ...ProjectLogic.getStats(project)
        }));
    }

    // Persistence
    saveToStorage() {
        const data = {
            projects: this.projects,
            currentProjectId: this.currentProjectId
        };
        localStorage.setItem('todoApp', JSON.stringify(data));
    }

    loadFromStorage() {
        const data = localStorage.getItem('todoApp');
        if (data) {
            const parsed = JSON.parse(data);
            this.projects = parsed.projects || [];
            this.currentProjectId = parsed.currentProjectId || null;
        }
    }

    // Recherche
    searchTodos(query) {
        const project = this.getCurrentProject();
        if (!project) return [];
        
        const lowerQuery = query.toLowerCase();
        return project.todos.filter(todo => 
            todo.title.toLowerCase().includes(lowerQuery) ||
            todo.description.toLowerCase().includes(lowerQuery) ||
            (todo.notes && todo.notes.toLowerCase().includes(lowerQuery))
        );
    }
}
