// Gestionnaire d'application pour gérer tous les projets
export class AppManager {
    constructor() {
        this.projects = [];
        this.currentProjectId = null;
        this.loadFromLocalStorage();
        
        // Créer un projet par défaut si aucun projet n'existe
        if (this.projects.length === 0) {
            this.createDefaultProject();
        }
    }

    createDefaultProject() {
        const defaultProject = {
            id: Date.now(),
            name: 'Mon Projet',
            todos: [],
            createdAt: new Date().toISOString()
        };
        this.projects.push(defaultProject);
        this.currentProjectId = defaultProject.id;
        this.saveToLocalStorage();
    }

    addProject(project) {
        this.projects.push(project);
        this.saveToLocalStorage();
    }

    removeProject(projectId) {
        // Ne pas supprimer s'il ne reste qu'un seul projet
        if (this.projects.length <= 1) {
            alert('Vous devez avoir au moins un projet !');
            return false;
        }
        
        this.projects = this.projects.filter(project => project.id !== projectId);
        
        // Si le projet actuel est supprimé, sélectionner le premier projet
        if (this.currentProjectId === projectId) {
            this.currentProjectId = this.projects[0].id;
        }
        
        this.saveToLocalStorage();
        return true;
    }

    getProject(projectId) {
        return this.projects.find(project => project.id === projectId);
    }

    getCurrentProject() {
        return this.getProject(this.currentProjectId);
    }

    setCurrentProject(projectId) {
        this.currentProjectId = projectId;
        this.saveToLocalStorage();
    }

    getAllProjects() {
        return this.projects;
    }

    saveToLocalStorage() {
        const data = {
            projects: this.projects,
            currentProjectId: this.currentProjectId
        };
        localStorage.setItem('todoApp', JSON.stringify(data));
    }

    loadFromLocalStorage() {
        const data = localStorage.getItem('todoApp');
        if (data) {
            const parsed = JSON.parse(data);
            this.projects = parsed.projects || [];
            this.currentProjectId = parsed.currentProjectId || null;
        }
    }
}
