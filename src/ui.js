// Module UI - Gestion de l'affichage et des interactions DOM
// Séparé de la logique métier
import { format, formatDistanceToNow, isToday, isPast, isFuture, isThisWeek, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

export class UIManager {
    constructor(appLogic) {
        this.app = appLogic;
        this.currentFilter = 'all';
        this.editingTodoId = null;
        this.tempChecklist = [];
        
        // Cache des éléments DOM
        this.elements = {};
        this.cacheElements();
        this.setupEventListeners();
    }

    cacheElements() {
        // Projets
        this.elements.projectsList = document.getElementById('projectsList');
        this.elements.projectTitle = document.getElementById('projectTitle');
        this.elements.addProjectBtn = document.getElementById('addProjectBtn');
        
        // Todos
        this.elements.todosList = document.getElementById('todosList');
        this.elements.addTodoBtn = document.getElementById('addTodoBtn');
        
        // Modals
        this.elements.projectModal = document.getElementById('projectModal');
        this.elements.todoModal = document.getElementById('todoModal');
        this.elements.todoDetailsModal = document.getElementById('todoDetailsModal');
        
        // Formulaire Projet
        this.elements.projectNameInput = document.getElementById('projectNameInput');
        this.elements.saveProjectBtn = document.getElementById('saveProjectBtn');
        this.elements.cancelProjectBtn = document.getElementById('cancelProjectBtn');
        
        // Formulaire Todo
        this.elements.todoTitle = document.getElementById('todoTitle');
        this.elements.todoDescription = document.getElementById('todoDescription');
        this.elements.todoDueDate = document.getElementById('todoDueDate');
        this.elements.todoPriority = document.getElementById('todoPriority');
        this.elements.todoNotes = document.getElementById('todoNotes');
        this.elements.checklistInput = document.getElementById('checklistInput');
        this.elements.addChecklistBtn = document.getElementById('addChecklistBtn');
        this.elements.checklistItems = document.getElementById('checklistItems');
        this.elements.saveTodoBtn = document.getElementById('saveTodoBtn');
        this.elements.cancelTodoBtn = document.getElementById('cancelTodoBtn');
        
        // Filtres et stats
        this.elements.filterButtons = document.querySelectorAll('.filter-btn');
        this.elements.statsContainer = document.getElementById('statsContainer');
        this.elements.searchInput = document.getElementById('searchInput');
        
        // Détails
        this.elements.closeDetailsBtn = document.getElementById('closeDetailsBtn');
        this.elements.detailsTitle = document.getElementById('detailsTitle');
        this.elements.todoDetailsContent = document.getElementById('todoDetailsContent');
    }

    setupEventListeners() {
        // Projets
        this.elements.addProjectBtn.addEventListener('click', () => this.openProjectModal());
        this.elements.saveProjectBtn.addEventListener('click', () => this.saveProject());
        this.elements.cancelProjectBtn.addEventListener('click', () => this.closeProjectModal());
        
        // Todos
        this.elements.addTodoBtn.addEventListener('click', () => this.openTodoModal());
        this.elements.saveTodoBtn.addEventListener('click', () => this.saveTodo());
        this.elements.cancelTodoBtn.addEventListener('click', () => this.closeTodoModal());
        this.elements.addChecklistBtn.addEventListener('click', () => this.addChecklistItem());
        
        // Checklist - Entrée
        this.elements.checklistInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.addChecklistItem();
            }
        });
        
        // Filtres
        this.elements.filterButtons.forEach(btn => {
            btn.addEventListener('click', () => this.handleFilterChange(btn));
        });
        
        // Recherche
        if (this.elements.searchInput) {
            this.elements.searchInput.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });
        }
        
        // Fermeture modals
        this.elements.projectModal.addEventListener('click', (e) => {
            if (e.target === this.elements.projectModal) this.closeProjectModal();
        });
        this.elements.todoModal.addEventListener('click', (e) => {
            if (e.target === this.elements.todoModal) this.closeTodoModal();
        });
        this.elements.todoDetailsModal.addEventListener('click', (e) => {
            if (e.target === this.elements.todoDetailsModal) this.closeTodoDetailsModal();
        });
        this.elements.closeDetailsBtn.addEventListener('click', () => this.closeTodoDetailsModal());
    }

    // ========== RENDU ==========

    render() {
        this.renderProjects();
        this.renderTodos();
        this.renderStats();
    }

    renderProjects() {
        this.elements.projectsList.innerHTML = '';
        const projects = this.app.getAllProjects();
        
        projects.forEach(project => {
            const li = this.createProjectElement(project);
            this.elements.projectsList.appendChild(li);
        });
        
        this.updateProjectTitle();
    }

    createProjectElement(project) {
        const div = document.createElement('div');
        div.className = 'project-item';
        if (project.id === this.app.currentProjectId) {
            div.classList.add('active');
        }
        
        const stats = this.app.getAllProjectsStats().find(s => s.projectId === project.id);
        
        div.innerHTML = `
            <span class="project-name">${this.escapeHtml(project.name)}</span>
            <span class="project-count">${stats.active}</span>
            ${project.id !== 'default' ? `<button class="delete-project-btn" data-id="${project.id}" title="Supprimer">×</button>` : ''}
        `;
        
        div.querySelector('.project-name').addEventListener('click', () => {
            this.app.setCurrentProject(project.id);
            this.render();
        });
        
        const deleteBtn = div.querySelector('.delete-project-btn');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.deleteProject(project.id);
            });
        }
        
        return div;
    }

    updateProjectTitle() {
        const currentProject = this.app.getCurrentProject();
        if (currentProject) {
            this.elements.projectTitle.textContent = currentProject.name;
        }
    }

    renderTodos() {
        this.elements.todosList.innerHTML = '';
        const todos = this.app.filterTodos(this.currentFilter);
        
        if (todos.length === 0) {
            this.renderEmptyState();
            return;
        }
        
        todos.forEach(todo => {
            const card = this.createTodoCard(todo);
            this.elements.todosList.appendChild(card);
        });
    }

    createTodoCard(todo) {
        const card = document.createElement('div');
        card.className = 'todo-card';
        if (todo.completed) card.classList.add('completed');
        
        const dueDate = new Date(todo.dueDate);
        const formattedDate = format(dueDate, 'EEEE d MMMM yyyy', { locale: fr });
        const relativeDate = formatDistanceToNow(dueDate, { addSuffix: true, locale: fr });
        const isOverdue = this.isOverdue(todo);
        const isDueToday = this.isDueToday(todo);
        const checklistProgress = this.getChecklistProgress(todo);
        
        card.innerHTML = `
            <div class="todo-header">
                <div class="todo-checkbox ${todo.completed ? 'checked' : ''}" data-id="${todo.id}"></div>
                <div class="todo-main">
                    <h3 class="todo-title">${this.escapeHtml(todo.title)}</h3>
                    <p class="todo-description">${this.escapeHtml(this.truncate(todo.description, 150))}</p>
                    <div class="todo-meta">
                        <span class="todo-badge priority-badge ${todo.priority}">
                            ${this.getPriorityText(todo.priority)}
                        </span>
                        <span class="todo-badge date-badge ${isOverdue ? 'overdue' : ''} ${isDueToday ? 'today' : ''}">
                            📅 ${formattedDate}
                        </span>
                        ${checklistProgress.total > 0 ? `
                            <span class="todo-badge">
                                ✓ ${checklistProgress.completed}/${checklistProgress.total}
                            </span>
                        ` : ''}
                    </div>
                </div>
            </div>
            ${checklistProgress.total > 0 ? `
                <div class="checklist-section">
                    <div class="checklist-header">
                        <span class="checklist-title">Checklist</span>
                        <span class="checklist-progress">${checklistProgress.completed}/${checklistProgress.total}</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${checklistProgress.percentage}%"></div>
                    </div>
                </div>
            ` : ''}
            <div class="todo-actions">
                <button class="todo-action-btn view" data-id="${todo.id}">👁️ Voir</button>
                <button class="todo-action-btn edit" data-id="${todo.id}">✏️ Modifier</button>
                <button class="todo-action-btn delete" data-id="${todo.id}">🗑️ Supprimer</button>
            </div>
        `;
        
        // Événements
        card.querySelector('.todo-checkbox').addEventListener('click', () => {
            this.toggleTodoComplete(todo.id);
        });
        
        card.querySelector('.view').addEventListener('click', () => {
            this.showTodoDetails(todo);
        });
        
        card.querySelector('.edit').addEventListener('click', () => {
            this.openTodoModalForEdit(todo);
        });
        
        card.querySelector('.delete').addEventListener('click', () => {
            this.deleteTodo(todo.id);
        });
        
        return card;
    }

    renderEmptyState() {
        const filterText = this.getFilterText(this.currentFilter);
        this.elements.todosList.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📭</div>
                <h3>Aucune tâche ${filterText}</h3>
                <p>Ajoutez une nouvelle tâche pour commencer !</p>
            </div>
        `;
    }

    renderStats() {
        if (!this.elements.statsContainer) return;
        
        const stats = this.app.getCurrentProjectStats();
        if (!stats) return;
        
        this.elements.statsContainer.innerHTML = `
            <div class="stat-item">
                <span class="stat-label">Total</span>
                <span class="stat-value">${stats.total}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Actives</span>
                <span class="stat-value">${stats.active}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Terminées</span>
                <span class="stat-value">${stats.completed}</span>
            </div>
            ${stats.overdue > 0 ? `
                <div class="stat-item stat-warning">
                    <span class="stat-label">En retard</span>
                    <span class="stat-value">${stats.overdue}</span>
                </div>
            ` : ''}
            ${stats.today > 0 ? `
                <div class="stat-item stat-info">
                    <span class="stat-label">Aujourd'hui</span>
                    <span class="stat-value">${stats.today}</span>
                </div>
            ` : ''}
        `;
    }

    // ========== GESTION PROJETS ==========

    openProjectModal() {
        this.elements.projectNameInput.value = '';
        this.elements.projectModal.classList.add('active');
        this.elements.projectNameInput.focus();
    }

    closeProjectModal() {
        this.elements.projectModal.classList.remove('active');
    }

    saveProject() {
        const name = this.elements.projectNameInput.value.trim();
        
        if (!name) {
            alert('Veuillez entrer un nom de projet !');
            return;
        }
        
        this.app.addProject(name);
        this.render();
        this.closeProjectModal();
    }

    deleteProject(projectId) {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce projet et toutes ses tâches ?')) {
            const result = this.app.removeProject(projectId);
            if (!result.success) {
                alert(result.message);
            } else {
                this.render();
            }
        }
    }

    deleteCurrentProject() {
        this.deleteProject(this.app.currentProjectId);
    }

    // ========== GESTION TODOS ==========

    openTodoModal() {
        this.editingTodoId = null;
        this.tempChecklist = [];
        this.clearTodoForm();
        document.getElementById('todoModalTitle').textContent = 'Nouvelle Tâche';
        this.elements.todoModal.classList.add('active');
        this.elements.todoTitle.focus();
    }

    openTodoModalForEdit(todo) {
        this.editingTodoId = todo.id;
        this.tempChecklist = JSON.parse(JSON.stringify(todo.checklist));
        
        this.elements.todoTitle.value = todo.title;
        this.elements.todoDescription.value = todo.description;
        this.elements.todoDueDate.value = todo.dueDate;
        this.elements.todoPriority.value = todo.priority;
        this.elements.todoNotes.value = todo.notes || '';
        
        this.renderChecklistItems();
        
        document.getElementById('todoModalTitle').textContent = 'Modifier la Tâche';
        this.elements.todoModal.classList.add('active');
    }

    closeTodoModal() {
        this.elements.todoModal.classList.remove('active');
        this.clearTodoForm();
    }

    clearTodoForm() {
        this.elements.todoTitle.value = '';
        this.elements.todoDescription.value = '';
        this.elements.todoDueDate.value = '';
        this.elements.todoPriority.value = 'medium';
        this.elements.todoNotes.value = '';
        this.elements.checklistInput.value = '';
        this.tempChecklist = [];
        this.elements.checklistItems.innerHTML = '';
    }

    saveTodo() {
        const todoData = {
            title: this.elements.todoTitle.value.trim(),
            description: this.elements.todoDescription.value.trim(),
            dueDate: this.elements.todoDueDate.value,
            priority: this.elements.todoPriority.value,
            notes: this.elements.todoNotes.value.trim(),
            checklist: this.tempChecklist
        };
        
        if (!todoData.title || !todoData.description || !todoData.dueDate) {
            alert('Veuillez remplir tous les champs obligatoires !');
            return;
        }
        
        if (this.editingTodoId) {
            this.app.updateTodoInCurrentProject(this.editingTodoId, todoData);
        } else {
            this.app.addTodoToCurrentProject(todoData);
        }
        
        this.render();
        this.closeTodoModal();
    }

    toggleTodoComplete(todoId) {
        this.app.toggleTodoComplete(todoId);
        this.render();
    }

    deleteTodo(todoId) {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
            this.app.removeTodoFromCurrentProject(todoId);
            this.render();
        }
    }

    // ========== CHECKLIST ==========

    addChecklistItem() {
        const text = this.elements.checklistInput.value.trim();
        if (!text) return;
        
        this.tempChecklist.push({
            id: Date.now() + Math.random(),
            text: text,
            completed: false
        });
        
        this.elements.checklistInput.value = '';
        this.renderChecklistItems();
    }

    renderChecklistItems() {
        this.elements.checklistItems.innerHTML = '';
        
        this.tempChecklist.forEach(item => {
            const div = document.createElement('div');
            div.className = 'modal-checklist-item';
            div.innerHTML = `
                <span>${this.escapeHtml(item.text)}</span>
                <button class="remove-checklist-item" data-id="${item.id}">×</button>
            `;
            
            div.querySelector('.remove-checklist-item').addEventListener('click', () => {
                this.tempChecklist = this.tempChecklist.filter(i => i.id !== item.id);
                this.renderChecklistItems();
            });
            
            this.elements.checklistItems.appendChild(div);
        });
    }

    // ========== DÉTAILS TODO ==========

    showTodoDetails(todo) {
        this.elements.detailsTitle.textContent = todo.title;
        
        const dueDate = new Date(todo.dueDate);
        const formattedDate = format(dueDate, 'EEEE d MMMM yyyy', { locale: fr });
        const relativeDate = formatDistanceToNow(dueDate, { addSuffix: true, locale: fr });
        const createdDate = parseISO(todo.createdAt);
        const createdFormatted = format(createdDate, 'd MMM yyyy à HH:mm', { locale: fr });
        const checklistProgress = this.getChecklistProgress(todo);
        
        let checklistHTML = '';
        if (todo.checklist && todo.checklist.length > 0) {
            checklistHTML = `
                <div class="details-section">
                    <h4>Checklist (${checklistProgress.completed}/${checklistProgress.total})</h4>
                    <div class="progress-bar-large">
                        <div class="progress-fill" style="width: ${checklistProgress.percentage}%"></div>
                    </div>
                    <ul class="checklist-items">
                        ${todo.checklist.map(item => `
                            <li class="checklist-item">
                                <span class="checklist-icon">${item.completed ? '✅' : '⬜'}</span>
                                <span class="${item.completed ? 'completed-text' : ''}">${this.escapeHtml(item.text)}</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            `;
        }
        
        this.elements.todoDetailsContent.innerHTML = `
            <div class="details-section">
                <h4>Description</h4>
                <p>${this.escapeHtml(todo.description)}</p>
            </div>
            <div class="details-grid">
                <div class="details-section">
                    <h4>Date d'échéance</h4>
                    <p class="detail-value">📅 ${formattedDate}</p>
                    <p class="detail-secondary">⏱️ ${relativeDate}</p>
                </div>
                <div class="details-section">
                    <h4>Priorité</h4>
                    <p><span class="priority-badge priority-${todo.priority}">${this.getPriorityText(todo.priority)}</span></p>
                </div>
            </div>
            ${todo.notes ? `
                <div class="details-section">
                    <h4>Notes</h4>
                    <p>${this.escapeHtml(todo.notes)}</p>
                </div>
            ` : ''}
            ${checklistHTML}
            <div class="details-section">
                <h4>Statut</h4>
                <p class="detail-value">${todo.completed ? '✅ Terminée' : '⏳ En cours'}</p>
            </div>
            <div class="details-section">
                <h4>Créée le</h4>
                <p class="detail-secondary">${createdFormatted}</p>
            </div>
            <div class="details-actions">
                <button class="btn-primary" id="editFromDetails">Modifier</button>
                <button class="btn-danger" id="deleteFromDetails">Supprimer</button>
            </div>
        `;
        
        // Événements
        document.getElementById('editFromDetails').addEventListener('click', () => {
            this.closeTodoDetailsModal();
            this.openTodoModalForEdit(todo);
        });
        
        document.getElementById('deleteFromDetails').addEventListener('click', () => {
            this.closeTodoDetailsModal();
            this.deleteTodo(todo.id);
        });
        
        this.elements.todoDetailsModal.classList.add('active');
    }

    closeTodoDetailsModal() {
        this.elements.todoDetailsModal.classList.remove('active');
    }

    // ========== FILTRES ET RECHERCHE ==========

    handleFilterChange(btn) {
        this.currentFilter = btn.dataset.filter;
        this.elements.filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.renderTodos();
    }

    handleSearch(query) {
        if (!query.trim()) {
            this.renderTodos();
            return;
        }
        
        const results = this.app.searchTodos(query);
        this.elements.todosList.innerHTML = '';
        
        if (results.length === 0) {
            this.elements.todosList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">🔍</div>
                    <h3>Aucun résultat</h3>
                    <p>Aucune tâche ne correspond à "${this.escapeHtml(query)}"</p>
                </div>
            `;
            return;
        }
        
        results.forEach(todo => {
            const card = this.createTodoCard(todo);
            this.elements.todosList.appendChild(card);
        });
    }

    // ========== UTILITAIRES ==========

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    formatDate(date) {
        return date.toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    }

    truncate(text, length) {
        return text.length > length ? text.substring(0, length) + '...' : text;
    }

    getPriorityText(priority) {
        const priorities = {
            'low': 'Basse',
            'medium': 'Moyenne',
            'high': 'Haute'
        };
        return priorities[priority] || priority;
    }

    getFilterText(filter) {
        const filters = {
            'all': '',
            'active': 'active',
            'completed': 'terminée',
            'today': 'pour aujourd\'hui',
            'upcoming': 'à venir',
            'overdue': 'en retard',
            'high': 'priorité haute',
            'medium': 'priorité moyenne',
            'low': 'priorité basse'
        };
        return filters[filter] || '';
    }

    isOverdue(todo) {
        if (todo.completed) return false;
        const dueDate = new Date(todo.dueDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return dueDate < today;
    }

    isDueToday(todo) {
        const dueDate = new Date(todo.dueDate);
        const today = new Date();
        return dueDate.toDateString() === today.toDateString();
    }

    getChecklistProgress(todo) {
        if (!todo.checklist || todo.checklist.length === 0) {
            return { completed: 0, total: 0, percentage: 0 };
        }
        const completed = todo.checklist.filter(item => item.completed).length;
        const total = todo.checklist.length;
        const percentage = Math.round((completed / total) * 100);
        return { completed, total, percentage };
    }
}
