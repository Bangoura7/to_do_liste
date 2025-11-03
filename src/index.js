// Import des styles et modules
import './styles.css';
import { AppManager } from './appManager.js';

// Initialisation de l'application
const app = new AppManager();
let currentFilter = 'all';
let editingTodoId = null;
let tempChecklist = [];

// Éléments DOM
const projectsList = document.getElementById('projectsList');
const projectTitle = document.getElementById('projectTitle');
const todosList = document.getElementById('todosList');
const addProjectBtn = document.getElementById('addProjectBtn');
const addTodoBtn = document.getElementById('addTodoBtn');
const deleteProjectBtn = document.getElementById('deleteProjectBtn');

// Modals
const projectModal = document.getElementById('projectModal');
const todoModal = document.getElementById('todoModal');
const todoDetailsModal = document.getElementById('todoDetailsModal');

// Formulaire Projet
const projectNameInput = document.getElementById('projectNameInput');
const saveProjectBtn = document.getElementById('saveProjectBtn');
const cancelProjectBtn = document.getElementById('cancelProjectBtn');

// Formulaire Todo
const todoTitleInput = document.getElementById('todoTitle');
const todoDescriptionInput = document.getElementById('todoDescription');
const todoDueDateInput = document.getElementById('todoDueDate');
const todoPriorityInput = document.getElementById('todoPriority');
const todoNotesInput = document.getElementById('todoNotes');
const checklistInput = document.getElementById('checklistInput');
const addChecklistBtn = document.getElementById('addChecklistBtn');
const checklistItemsList = document.getElementById('checklistItems');
const saveTodoBtn = document.getElementById('saveTodoBtn');
const cancelTodoBtn = document.getElementById('cancelTodoBtn');

// Filtres
const filterButtons = document.querySelectorAll('.filter-btn');

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    renderProjects();
    renderTodos();
    setupEventListeners();
});

// Configuration des événements
function setupEventListeners() {
    // Projets
    addProjectBtn.addEventListener('click', openProjectModal);
    saveProjectBtn.addEventListener('click', saveProject);
    cancelProjectBtn.addEventListener('click', closeProjectModal);
    deleteProjectBtn.addEventListener('click', deleteCurrentProject);

    // Todos
    addTodoBtn.addEventListener('click', openTodoModal);
    saveTodoBtn.addEventListener('click', saveTodo);
    cancelTodoBtn.addEventListener('click', closeTodoModal);
    addChecklistBtn.addEventListener('click', addChecklistItem);
    
    // Checklist input - ajouter avec Entrée
    checklistInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addChecklistItem();
        }
    });

    // Filtres
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            currentFilter = btn.dataset.filter;
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderTodos();
        });
    });

    // Fermer modal en cliquant à l'extérieur
    projectModal.addEventListener('click', (e) => {
        if (e.target === projectModal) closeProjectModal();
    });
    todoModal.addEventListener('click', (e) => {
        if (e.target === todoModal) closeTodoModal();
    });
    todoDetailsModal.addEventListener('click', (e) => {
        if (e.target === todoDetailsModal) closeTodoDetailsModal();
    });

    document.getElementById('closeDetailsBtn').addEventListener('click', closeTodoDetailsModal);
}

// ========== GESTION DES PROJETS ==========

function renderProjects() {
    projectsList.innerHTML = '';
    const projects = app.getAllProjects();
    
    projects.forEach(project => {
        const li = document.createElement('li');
        li.className = 'project-item';
        if (project.id === app.currentProjectId) {
            li.classList.add('active');
        }
        
        li.innerHTML = `
            <span>${escapeHtml(project.name)}</span>
            <button class="project-item-delete" data-id="${project.id}">×</button>
        `;
        
        li.querySelector('span').addEventListener('click', () => {
            app.setCurrentProject(project.id);
            renderProjects();
            renderTodos();
        });
        
        li.querySelector('.project-item-delete').addEventListener('click', (e) => {
            e.stopPropagation();
            deleteProject(project.id);
        });
        
        projectsList.appendChild(li);
    });
    
    updateProjectTitle();
}

function updateProjectTitle() {
    const currentProject = app.getCurrentProject();
    if (currentProject) {
        projectTitle.textContent = currentProject.name;
    }
}

function openProjectModal() {
    projectNameInput.value = '';
    projectModal.classList.remove('hidden');
    projectNameInput.focus();
}

function closeProjectModal() {
    projectModal.classList.add('hidden');
}

function saveProject() {
    const name = projectNameInput.value.trim();
    
    if (!name) {
        alert('Veuillez entrer un nom de projet !');
        return;
    }
    
    const project = {
        id: Date.now(),
        name: name,
        todos: [],
        createdAt: new Date().toISOString()
    };
    
    app.addProject(project);
    app.setCurrentProject(project.id);
    renderProjects();
    renderTodos();
    closeProjectModal();
}

function deleteProject(projectId) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce projet et toutes ses tâches ?')) {
        if (app.removeProject(projectId)) {
            renderProjects();
            renderTodos();
        }
    }
}

function deleteCurrentProject() {
    deleteProject(app.currentProjectId);
}

// ========== GESTION DES TODOS ==========

function renderTodos() {
    todosList.innerHTML = '';
    const currentProject = app.getCurrentProject();
    
    if (!currentProject) return;
    
    let todos = currentProject.todos;
    
    // Appliquer les filtres
    switch (currentFilter) {
        case 'active':
            todos = todos.filter(todo => !todo.completed);
            break;
        case 'completed':
            todos = todos.filter(todo => todo.completed);
            break;
        case 'high':
        case 'medium':
        case 'low':
            todos = todos.filter(todo => todo.priority === currentFilter);
            break;
    }
    
    if (todos.length === 0) {
        todosList.innerHTML = `
            <div class="empty-state">
                <h3>📭 Aucune tâche</h3>
                <p>Ajoutez une nouvelle tâche pour commencer !</p>
            </div>
        `;
        return;
    }
    
    todos.forEach(todo => {
        const card = createTodoCard(todo);
        todosList.appendChild(card);
    });
}

function createTodoCard(todo) {
    const card = document.createElement('div');
    card.className = `todo-card priority-${todo.priority}`;
    if (todo.completed) {
        card.classList.add('completed');
    }
    
    const dueDate = new Date(todo.dueDate);
    const formattedDate = dueDate.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
    
    card.innerHTML = `
        <div class="todo-header">
            <div class="todo-title-section">
                <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''}>
                <h3 class="todo-title">${escapeHtml(todo.title)}</h3>
            </div>
            <div class="todo-actions">
                <button class="btn-small btn-view">👁️ Voir</button>
                <button class="btn-small btn-edit">✏️ Modifier</button>
                <button class="btn-small btn-delete">🗑️</button>
            </div>
        </div>
        <p class="todo-description">${escapeHtml(todo.description)}</p>
        <div class="todo-meta">
            <span class="todo-meta-item">📅 ${formattedDate}</span>
            <span class="priority-badge priority-${todo.priority}">${getPriorityText(todo.priority)}</span>
            ${todo.checklist && todo.checklist.length > 0 ? `<span class="todo-meta-item">✓ ${todo.checklist.filter(item => item.completed).length}/${todo.checklist.length}</span>` : ''}
        </div>
    `;
    
    // Événements
    card.querySelector('.todo-checkbox').addEventListener('change', () => {
        toggleTodoComplete(todo.id);
    });
    
    card.querySelector('.btn-view').addEventListener('click', () => {
        showTodoDetails(todo);
    });
    
    card.querySelector('.btn-edit').addEventListener('click', () => {
        openTodoModalForEdit(todo);
    });
    
    card.querySelector('.btn-delete').addEventListener('click', () => {
        deleteTodo(todo.id);
    });
    
    return card;
}

function openTodoModal() {
    editingTodoId = null;
    tempChecklist = [];
    clearTodoForm();
    document.getElementById('todoModalTitle').textContent = 'Nouvelle Tâche';
    todoModal.classList.remove('hidden');
    todoTitleInput.focus();
}

function openTodoModalForEdit(todo) {
    editingTodoId = todo.id;
    tempChecklist = [...todo.checklist];
    
    todoTitleInput.value = todo.title;
    todoDescriptionInput.value = todo.description;
    todoDueDateInput.value = todo.dueDate;
    todoPriorityInput.value = todo.priority;
    todoNotesInput.value = todo.notes || '';
    
    renderChecklistItems();
    
    document.getElementById('todoModalTitle').textContent = 'Modifier la Tâche';
    todoModal.classList.remove('hidden');
}

function closeTodoModal() {
    todoModal.classList.add('hidden');
    clearTodoForm();
}

function clearTodoForm() {
    todoTitleInput.value = '';
    todoDescriptionInput.value = '';
    todoDueDateInput.value = '';
    todoPriorityInput.value = 'medium';
    todoNotesInput.value = '';
    checklistInput.value = '';
    tempChecklist = [];
    checklistItemsList.innerHTML = '';
}

function saveTodo() {
    const title = todoTitleInput.value.trim();
    const description = todoDescriptionInput.value.trim();
    const dueDate = todoDueDateInput.value;
    const priority = todoPriorityInput.value;
    const notes = todoNotesInput.value.trim();
    
    if (!title || !description || !dueDate) {
        alert('Veuillez remplir tous les champs obligatoires (titre, description, date) !');
        return;
    }
    
    const currentProject = app.getCurrentProject();
    if (!currentProject) return;
    
    if (editingTodoId) {
        // Modification
        const todo = currentProject.todos.find(t => t.id === editingTodoId);
        if (todo) {
            todo.title = title;
            todo.description = description;
            todo.dueDate = dueDate;
            todo.priority = priority;
            todo.notes = notes;
            todo.checklist = tempChecklist;
        }
    } else {
        // Création
        const newTodo = {
            id: Date.now() + Math.random(),
            title,
            description,
            dueDate,
            priority,
            notes,
            checklist: tempChecklist,
            completed: false,
            createdAt: new Date().toISOString()
        };
        currentProject.todos.push(newTodo);
    }
    
    app.saveToLocalStorage();
    renderTodos();
    closeTodoModal();
}

function toggleTodoComplete(todoId) {
    const currentProject = app.getCurrentProject();
    if (!currentProject) return;
    
    const todo = currentProject.todos.find(t => t.id === todoId);
    if (todo) {
        todo.completed = !todo.completed;
        app.saveToLocalStorage();
        renderTodos();
    }
}

function deleteTodo(todoId) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
        const currentProject = app.getCurrentProject();
        if (!currentProject) return;
        
        currentProject.todos = currentProject.todos.filter(t => t.id !== todoId);
        app.saveToLocalStorage();
        renderTodos();
    }
}

// ========== GESTION CHECKLIST ==========

function addChecklistItem() {
    const text = checklistInput.value.trim();
    if (!text) return;
    
    tempChecklist.push({
        id: Date.now(),
        text: text,
        completed: false
    });
    
    checklistInput.value = '';
    renderChecklistItems();
}

function renderChecklistItems() {
    checklistItemsList.innerHTML = '';
    
    tempChecklist.forEach(item => {
        const li = document.createElement('li');
        li.className = 'checklist-item';
        li.innerHTML = `
            <input type="checkbox" ${item.completed ? 'checked' : ''}>
            <span>${escapeHtml(item.text)}</span>
            <button>×</button>
        `;
        
        li.querySelector('input').addEventListener('change', (e) => {
            item.completed = e.target.checked;
        });
        
        li.querySelector('button').addEventListener('click', () => {
            tempChecklist = tempChecklist.filter(i => i.id !== item.id);
            renderChecklistItems();
        });
        
        checklistItemsList.appendChild(li);
    });
}

// ========== DÉTAILS TODO ==========

function showTodoDetails(todo) {
    const detailsContent = document.getElementById('todoDetailsContent');
    document.getElementById('detailsTitle').textContent = todo.title;
    
    const dueDate = new Date(todo.dueDate);
    const formattedDate = dueDate.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
    
    let checklistHTML = '';
    if (todo.checklist && todo.checklist.length > 0) {
        checklistHTML = `
            <div class="form-group">
                <label>Checklist</label>
                <ul class="checklist-items">
                    ${todo.checklist.map(item => `
                        <li class="checklist-item">
                            <input type="checkbox" ${item.completed ? 'checked' : ''} disabled>
                            <span>${escapeHtml(item.text)}</span>
                        </li>
                    `).join('')}
                </ul>
            </div>
        `;
    }
    
    detailsContent.innerHTML = `
        <div class="form-group">
            <label>Description</label>
            <p>${escapeHtml(todo.description)}</p>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label>Date d'échéance</label>
                <p>📅 ${formattedDate}</p>
            </div>
            <div class="form-group">
                <label>Priorité</label>
                <p><span class="priority-badge priority-${todo.priority}">${getPriorityText(todo.priority)}</span></p>
            </div>
        </div>
        ${todo.notes ? `
            <div class="form-group">
                <label>Notes</label>
                <p>${escapeHtml(todo.notes)}</p>
            </div>
        ` : ''}
        ${checklistHTML}
        <div class="form-group">
            <label>Statut</label>
            <p>${todo.completed ? '✅ Terminée' : '⏳ En cours'}</p>
        </div>
    `;
    
    todoDetailsModal.classList.remove('hidden');
}

function closeTodoDetailsModal() {
    todoDetailsModal.classList.add('hidden');
}

// ========== UTILITAIRES ==========

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function getPriorityText(priority) {
    const priorities = {
        'low': 'Basse',
        'medium': 'Moyenne',
        'high': 'Haute'
    };
    return priorities[priority] || priority;
}
