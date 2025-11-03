// Classe Todo pour créer des tâches
export class Todo {
    constructor(title, description, dueDate, priority = 'medium', notes = '', checklist = []) {
        this.id = Date.now() + Math.random(); // ID unique
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority; // 'low', 'medium', 'high'
        this.notes = notes;
        this.checklist = checklist; // Tableau d'objets {text: '', completed: false}
        this.completed = false;
        this.createdAt = new Date().toISOString();
    }

    toggleComplete() {
        this.completed = !this.completed;
    }

    updateTitle(newTitle) {
        this.title = newTitle;
    }

    updateDescription(newDescription) {
        this.description = newDescription;
    }

    updateDueDate(newDueDate) {
        this.dueDate = newDueDate;
    }

    updatePriority(newPriority) {
        this.priority = newPriority;
    }

    updateNotes(newNotes) {
        this.notes = newNotes;
    }

    addChecklistItem(text) {
        this.checklist.push({
            id: Date.now(),
            text: text,
            completed: false
        });
    }

    toggleChecklistItem(itemId) {
        const item = this.checklist.find(item => item.id === itemId);
        if (item) {
            item.completed = !item.completed;
        }
    }

    removeChecklistItem(itemId) {
        this.checklist = this.checklist.filter(item => item.id !== itemId);
    }
}
