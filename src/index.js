// Import des styles et modules
import './styles.css';
import { AppLogic } from './logic.js';
import { UIManager } from './ui.js';

// Initialisation de l'application
let app;
let ui;

// Démarrage au chargement du DOM
document.addEventListener('DOMContentLoaded', () => {
    app = new AppLogic();
    ui = new UIManager(app);
    ui.render();
});

